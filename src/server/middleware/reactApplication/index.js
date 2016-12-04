/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { RoutesProvider, matchRoutesToLocation } from 'react-router-addons-routes';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import generateHTML from './generateHTML';
import App from '../../../shared/components/App';
import { createReduxStore } from '../../../shared/Data';
import routes from '../../../shared/components/App/routes';


function fetchServerData(request, dispatch) {
  const location = { pathname: request.path };
  const { matchedRoutes, params } = matchRoutesToLocation(routes, location);
  const locals = {
    path: request.path,
    params,
    matchedRoutes,
    dispatch,
  };

  return Promise.all(
  matchedRoutes.filter(route => route.component && route.component.serverFetch)
  .map(route => route.component.serverFetch(locals)));
}


/**
 * An express middleware that is capabable of doing React server side rendering.
 */
function universalReactAppMiddleware(request: $Request, response: $Response) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;
  const initialState = {
    ssr: {
      graphQLUrl: 'http://localhost:9123',
    },
  };


  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (!process.env.SSR_ENABLED === 'false') {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> Handling react route without SSR');  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = generateHTML({
      // Nonce which allows us to safely declare inline scripts.
      nonce,
      initialState,
    });
    response.status(200).send(html);
    return;
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = createServerRenderContext();

  // We also create a context for our <CodeSplitProvider> which will allow us
  // to query which chunks/modules were used during the render process.
  const codeSplitContext = createRenderContext();
  const reduxStore = createReduxStore({
    initialState,
    reducers: App.getReducers(),
    enhancers: App.getEnhancers(),
    middlewares: App.getMiddlewares(),
  });


  fetchServerData(request, reduxStore.dispatch).then(() => {
    const reduxState = reduxStore.getState();

    const renderedApp = renderToString(<CodeSplitProvider context={codeSplitContext}>
      <ServerRouter location={request.url} context={reactRouterContext}>
        <Provider store={reduxStore}>
          <RoutesProvider routes={routes}>
            <App />
          </RoutesProvider>
        </Provider>
      </ServerRouter>
    </CodeSplitProvider>);

    // Generate the html response.
    const html = generateHTML({
      // Provide the full app react element.
      app: renderedApp,

      initialState: reduxState,

      // Nonce which allows us to safely declare inline scripts.
      nonce,
      // Running this gets all the helmet properties (e.g. headers/scripts/title etc)
      // that need to be included within our html.  It's based on the rendered app.
      // @see https://github.com/nfl/react-helmet
      helmet: Helmet.rewind(),
      // We provide our code split state so that it can be included within the
      // html, and then the client bundle can use this data to know which chunks/
      // modules need to be rehydrated prior to the application being rendered.
      codeSplitState: codeSplitContext.getState(),
    });

    // Get the render result from the server render context.
    const renderResult = reactRouterContext.getResult();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (renderResult.redirect) {
      response.status(301).setHeader('Location', renderResult.redirect.pathname);
      response.end();
      return;
    }

    response
      .status(
        renderResult.missed
          // If the renderResult contains a "missed" match then we set a 404 code.
          // Our App component will handle the rendering of an Error404 view.
          ? 404
          // Otherwise everything is all good and we send a 200 OK status.
          : 200,
      )
      .send(html);
  });
}

export default (universalReactAppMiddleware : Middleware);
