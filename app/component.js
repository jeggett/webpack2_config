// @flow
// $FlowFixMe cant find module babel-polyfill
import 'babel-polyfill'; // eslint-disable-line
import src from './static/images/images.png';

const element = function element() {
  const img = document.createElement('img');
  img.src = src;

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

  const btn = document.createElement('span');
  btn.className = 'pure-button fa fa-bell fa-1g';
  btn.innerHTML = 'Hello World!';
  btn.onclick = () => {
    // $FlowFixMe. Could not resolve name
    System.import('./lazy').then((lazy) => {
      btn.textContent = lazy.default;
    }).catch((err) => {
      console.error(err); // eslint-disable-line no-console
    });
  };

  const div = document.createElement('div');
  div.appendChild(img);
  div.appendChild(btn);

  return div;
};

const treeShakingDemo = function treeShakingDemo() {
  return 'this should get shaken out';
};

export {
  element,
  treeShakingDemo,
};
