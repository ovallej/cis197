// src/components/About/index.js
import React, { Component } from 'react';
import classnames from 'classnames';

import './style.css';

class About extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  
  constructor(){
    super();
  }

  componentDidMount() {
    console.log(this.props);
    console.log(this.props.params);
    console.log(this.props.routeParams);
    console.log(this.props.location);
    console.log(this.props.route);

  }
  


  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('About', className)} {...props}>
        <h1>
          About
        </h1>
      </div>
    );
  }
}

export default About;
