import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export default function init() {
  ReactDOM.render(<App/>, document.getElementById("rootId"));
}
