// src/components/About/index.js
import React, { Component } from 'react';
import classnames from 'classnames';
import $ from 'jquery';

import './index.css';
import Board from '../Test';

class Event extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  
  constructor(){
    super();
  }

  componentDidMount() {

    var thisEvent = this.props.params.pathParam;
    $.ajax({
        url: '/eventData/' + thisEvent, //this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          //this.setState({data: data});
          console.log(data);
          
          //this.setState({grid: grid});
      }.bind(this)
    });


  }

  render() {
    const { className, ...props } = this.props;
    // two calndars?
    var weekDays = [1,2,3,4];
    return (
      <div className={classnames('Event', className)} {...props}>
        <h1>
          Event {this.props.params.pathParam}
        </h1>
        <Board days={weekDays}/>
      </div>
    );
  }
}

export default Event;
