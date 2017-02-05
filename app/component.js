// @flow
// $FlowFixMe cant find module babel-polyfill
import 'babel-polyfill'; // eslint-disable-line

const element = function element() {
  const img = document.createElement('img');
  import src from './static/images/images.png'; // eslint-disable-line
  img.src = src;

  // ============ test async await ==============
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
  // ============ test async await ==============

  // ============ test object rest/spread ==============

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

export {
  element,
  treeShakingDemo,
};
