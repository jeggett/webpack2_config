import src from './static/images/images.png';

export default function () {
  const img = document.createElement('img');
  img.src = src;

  const btn = document.createElement('span');
  btn.className = 'pure-button fa fa-bell fa-1g';
  btn.innerHTML = 'Hello';

  const div = document.createElement('div');
  div.appendChild(img);
  div.appendChild(btn);

  return div;
}
