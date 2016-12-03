import { CodeSplit } from 'code-split-component';
import React from 'react';

function codeSplitHome(routerProps) {
  return (<CodeSplit chunkName="home" modules={{ Home: require('./Home') }}>
    { ({ Home }) => Home && <Home {...routerProps} /> }
  </CodeSplit>);
}

function codeSplitAbout(routerProps) {
  return (<CodeSplit chunkName="about" modules={{ About: require('./About') }}>
    { ({ About }) => About && <About {...routerProps} /> }
  </CodeSplit>);
}

const routes = [
  {
    pattern: '/',
    name: 'home',
    component: process.env.IS_CLIENT ? codeSplitHome : require('./Home').default,
  },
  {
    pattern: '/about/:id',
    name: 'about',
    component: process.env.IS_CLIENT ? codeSplitAbout : require('./About').default,
  },
];
export default routes;
