import React, { Component } from 'react';
import './style.css';

class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }
  render() {
    return (
      <button className="Square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

export default Square;