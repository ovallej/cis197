import React, { Component } from 'react';
import classnames from 'classnames';
import $ from 'jquery';

import './index.css';
import Board from '../Test';
import EventBoard from '../EventBoard';

class Event extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  
  constructor(){
    super();
    this.state = {
      data: {},
      ready: false,
      user: '',
      loggedEvent: '',
      auth: false
    };

  }

  componentDidMount() {

    var thisEvent = this.props.params.pathParam;
    $.ajax({
        url: '/eventData/' + thisEvent, //this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          //this.setState({data: data});
          console.log("SETTING STATE DATA_EVENTCOMPONENT");
          console.log(data);
          this.setState({data: data.event, ready: true, user: data.user, auth: data.auth, loggedEvent: data.loggedEvent});
      }.bind(this)
    });


  }

  render() {
    console.log("EVENT COMPONENT RENER");
    console.log(this.state.data);
    var data = this.state.data;
    const { className, ...props } = this.props;
    // two calndars?
    var weekDays = [1,2,3,4];
    return (
      <div className={classnames('Event', className)} {...props}>
        <h1>
          Event {this.props.params.pathParam}
        </h1>
        {this.state.ready ? (<div><Board data={data} user={this.state.user} auth={this.state.auth} loggedEvent={this.state.loggedEvent}/>
        <EventBoard data={data}/></div> ) : <p>Loading</p>}
        
      </div>
    );
  }
}

export default Event;
