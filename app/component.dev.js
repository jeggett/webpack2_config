// @flow
// $FlowFixMe cant find module babel-polyfill
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import 'babel-polyfill'; // eslint-disable-line
import React, { Component } from 'react';
import src from './static/images/images.png'; // eslint-disable-line

const notReactComponent = function element() {
  const img = document.createElement('img');
  img.src = src;

  // ============ test async await BEGIN ==============
  function resolveAfter2Seconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  async function add1(x) {
    const a = resolveAfter2Seconds(20);
    const b = resolveAfter2Seconds(30);
    return x + await a + await b;
  }

  // Prints 60 after 2 seconds.
  add1(10).then((v) => {
    console.log(v); // eslint-disable-line no-console
  });
  // ============ test async await END ==============

  // ============ test object rest/spread BEGIN ==============

  // ============ test object rest/spread ==============

  const btn = document.createElement('span');
  btn.className = 'pure-button fa fa-bell fa-1g';
  btn.innerHTML = 'Hello World!!';
  btn.onclick = () => {
    // $FlowFixMe. Could not resolve name
    System.import('./lazy').then((lazy) => {
      btn.textContent = lazy.default;
    }).catch((err) => {
      console.error(err); // eslint-disable-line no-console
    });
  };

  const link = document.createElement('a');
  link.innerHTML = 'Link';

  const div = document.createElement('div');
  div.appendChild(img);
  div.appendChild(btn);
  div.appendChild(link);

  return div;
};

const treeShakingDemo = function treeShakingDemo() {
  return 'this should get shaken out';
};


const addOne = ({ amount }) => ({ amount: amount + 1 });
class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { amount: 0 };
  }

  render() {
    return (
      <AppContainer>
        <div>
          <span className="pure-button fa-hand-spock-o fa-1g">
            Amount: {this.state.amount}
          </span>
          <button
            onClick={() => this.setState(addOne)}
          >
            Add one!
          </button>
        </div>
      </AppContainer>
    );
  }
}

export {
  Counter,
  notReactComponent,
  treeShakingDemo,
};

