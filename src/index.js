// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'

import Routes from './routes';

import './index.css';

//console.log(props);
//console.log(this.props);
ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
