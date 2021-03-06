import React, { Component } from 'react';
import classnames from 'classnames';
import { withRouter } from 'react-router' 

import './style.css';
import Square from './Square';
import $ from 'jquery'; 

class Calendar extends Component {

  constructor(props){
    super(props);
    var days = [0,1,2,3,4,5,6];
    var weeks = [0,1,2,3,4];

    this.state = {
      days: days,
      weeks: weeks,
      selected: [],
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


  }
  squareClick(obj) {
    var index = -1;
    var currSelected = this.state.selected.slice();

    for (var i = 0; i < currSelected.length; i++) {
      if (obj.month === currSelected[i].month &&
        obj.day === currSelected[i].day) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      currSelected.splice(index, 1);
    } else {
      currSelected.push(obj);
      currSelected.sort(function (x, y) {
        if (y.month !== x.month) {
          return x.month - y.month;
        } else {
          return x.day - y.day;
        }
      });
    }
    this.setState({ selected: currSelected });


  }


  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    // console.log(this.props);
    var data = { event: this.state.value, dates: this.state.selected };
    // console.log(data);
    $.ajax({
      type: 'POST',
      url: '/event',
      dataType: 'json',
      data: data,
      success: function (data) {
        // console.log(data);
        this.props.router.push('/EventPage/' + this.state.value);
      }.bind(this),
      error: function (err) {
        console.log(err);
      }.bind(this)
    });


    event.preventDefault();
  }




  render() {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    var date = new Date(); // get current date
    var first = date.getDate() - date.getDay();
    var monthIDX = date.getMonth();
    var before = (<p> {months[monthIDX]}</p>);
    var after = (<p> {months[(monthIDX+1) % 12]}</p>);

    date.setDate(first);
    var curr = this;
    var dateRow = curr.state.weeks.map(function (e, i) {
      var inner = curr.state.days.map(function (elem, y) {
        var currMonth = date.getMonth();
        var currDate = date.getDate();
        date.setDate(date.getDate()+1);
        function indexOf(event, eventDates) {
          for (var i = 0; i < eventDates.length; i++) {
            if (event.day == eventDates[i].day && event.month == eventDates[i].month) {
              return i;
            }
          }
          return -1;
        }
        var obj = {day: currDate, month:currMonth};
        var idx = indexOf(obj, curr.state.selected);
        var style = (idx >= 0) ? 'green' : 'blue';
        return (<Square value={currDate} color={style} onClick={() => curr.squareClick({day: currDate, month:currMonth})} />);
      });
      return (<div className="board-row"> {inner} </div>);
    });
    return (
      <div className='Calendar'>
        <h1>
          Calendar 
        </h1>
        <div> Choose dates and a name to create Your Event! (You will be redirected to your event link)</div>
        {before}
        {dateRow}
        {after}
        <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text"  class="form-control" name="password" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default withRouter(Calendar);
