// src/components/App/index.js
import React, { Component } from 'react';
import classnames from 'classnames';

import logo from './logo.svg';
import './style.css';
import $ from 'jquery'; 


class App extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}

  componentDidMount() {
    console.log(this.props);
    $.ajax({
      url: '/data',//this.props.url,
      dataType: 'html',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
        console.log(err);
      }.bind(this)
    });
  }

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('App', className)} {...props}>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
