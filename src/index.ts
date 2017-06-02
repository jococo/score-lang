/*
  index.ts
*/

import {div, h1, button, obs_of} from "./lib/html-rx";

import "./style.css";

type Tuple = [string, object, [any]];


let someText = obs_of('normal');
let someClass = obs_of();

function clickHandler(e) {
  someText.onNext('This has changed');
  someClass.onNext('warning');
}

const root = document.getElementById('main');

root.appendChild(div({class: 'panel'}, [
  h1({text: someText, class: someClass}, 'Hey'),
  button({click: clickHandler}, 'Click')
]));

