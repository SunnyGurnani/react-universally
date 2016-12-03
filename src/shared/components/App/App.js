/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { MatchWithRoutes } from 'react-router-addons-routes';
import 'normalize.css/normalize.css';
import './globals.css';
import Error404 from './Error404';
import Header from './Header';
import { WEBSITE_TITLE, WEBSITE_DESCRIPTION } from '../../constants';
import { counterReducer } from './CounterModule';

class App extends React.Component {
  render() {
    return (
      <div style={{ padding: '10px' }}>
        {/*
          All of the following will be injected into our page header.
          @see https://github.com/nfl/react-helmet
        */}
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          titleTemplate={`${WEBSITE_TITLE} - %s`}
          defaultTitle={WEBSITE_TITLE}
          meta={[
            { name: 'description', content: WEBSITE_DESCRIPTION },
            // Default content encoding.
            { name: 'charset', content: 'utf-8' },
            // @see http://bit.ly/2f8IaqJ
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            // This is important to signify your application is mobile responsive!
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            // Providing a theme color is good if you are doing a progressive
            // web application.
            { name: 'theme-color', content: '#2b2b2b' },
          ]}
          link={[
            // When building a progressive web application you need to supply
            // a manifest.json as well as a variety of icon types. This can be
            // tricky. Luckily there is a service to help you with this.
            // http://realfavicongenerator.net/
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
            { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
            { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#00a9d9' },
            // Make sure you update your manifest.json to match your application.
            { rel: 'manifest', href: '/manifest.json' },
          ]}
          script={[]}
        />

        <Header />
        { this.context.routes.map(route => <MatchWithRoutes key={route.name} {...route} />) }
      </div>
    );
  }
}

App.contextTypes = {
  routes: React.PropTypes.array,
};

/**
 * Return list of Redux store enhancers to use
 */
App.getEnhancers = function () {
  return [];
};

/**
 * Create mapping of reducers to use for the Redux store
 */
App.getReducers = function () {
  return {
    counter: counterReducer,
  };
};

/**
 * Create list of Redux middleware to use.
 */
App.getMiddlewares = function () {
  const middlewares = [];

  if (process.env.IS_CLIENT && process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger({ collapsed: true }));
  }
  return middlewares;
};


export default App;
