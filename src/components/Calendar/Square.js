import React, { Component } from 'react';
import './style.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
    return (
      <button className="button" style={{background: this.props.color}}onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

export default Square;