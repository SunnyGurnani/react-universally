/* @flow */
/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router';
import { Provider } from "react-redux";
// This library provides us with the capability to have declerative code
// splitting within our application.
// @see https://github.com/ctrlplusb/code-split-component
import { CodeSplitProvider, rehydrateState } from 'code-split-component';
// This registers our service worker for asset caching and offline support.
import './registerServiceWorker';
import ReactHotLoader from './components/ReactHotLoader';
import App from '../shared/components/App';
import { createReduxStore } from '../shared/Data';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

function renderApp(TheApp) {
  const reduxStore = createReduxStore({
    reducers: App.getReducers(),
    enhancers: App.getEnhancers(),
    middlewares: App.getMiddlewares(),
    initialState: window.APP_STATE,
  });


  // Firstly we ensure that we rehydrate any code split state provided to us
  // by the server response. This state typically indicates which bundles/chunks
  // need to be registered for our application to render and the React checksum
  // to match the server response.
  // @see https://github.com/ctrlplusb/code-split-component
  rehydrateState().then(codeSplitState =>
    render(
      <ReactHotLoader>
        <CodeSplitProvider state={codeSplitState}>
          <Provider store={reduxStore}>
            <BrowserRouter>
              <TheApp />
            </BrowserRouter>
          </Provider>
        </CodeSplitProvider>
      </ReactHotLoader>,
      container,
    ),
  );
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    '../shared/components/App',
    () => renderApp(require('../shared/components/App').default),
  );
}

renderApp(App);
