// import React from 'react';
// import ReactDOM from 'react-dom';
import 'purecss';
import './static/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.css';
import { element } from './component';

let demoComponent = element();

document.body.appendChild(demoComponent);

// HMR interface
if (module.hot) {
  // Capture hot update
  module.hot.accept('./component', () => {
    // We have to go through CommonJS here and capture the
    // default export explicitly
    const nextComponent = require('./component').default(); // eslint-disable-line global-require
    // Replace old content with the hot loaded one
    document.body.replaceChild(nextComponent, demoComponent);

    demoComponent = nextComponent;
  });
}

