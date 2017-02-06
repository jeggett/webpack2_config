import 'purecss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Counter } from './componentWrapper';
import '../node_modules/font-awesome/css/font-awesome.css';
import './static/styles/main.scss';

const render = (App) => {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );
};

render(Counter);

// HMR interface
if (module.hot) {
  // Capture hot update
  module.hot.accept('./componentWrapper', () => render(Counter));
}

