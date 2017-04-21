// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router'

import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';
import Game from './components/Test';
import Calendar from './components/Calendar';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/about" component={About} />
    <Route path="/game" component={Game} />
    <Route path="/calendar" component={Calendar} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
