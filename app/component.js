import src from './static/images/images.png';

export default function () {
  const img = document.createElement('img');
  img.src = src;

  const btn = document.createElement('span');
  btn.className = 'pure-button fa fa-bell fa-1g';
  btn.innerHTML = 'Hello World!';
  btn.onclick = () => {
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
}
