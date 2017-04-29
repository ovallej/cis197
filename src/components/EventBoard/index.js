import React, { Component } from 'react';
import classnames from 'classnames';
//import ReactDOM from 'react-dom';
//import App from './App';
import './index.css';
import $ from 'jquery'; 


class Square extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}
  
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    const { className, ...props } = this.props;
    return (
      <button className={classnames('Square', className)} {...props} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class EventBoard extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}

  constructor(props) {
    super(props);
    var times = ['9:00', '10:00',
        '11:00', '12:00',
        '1:00', '2:00', '3:00',
        '4:00', '5:00',
        '6:00', '7:00',
        '8:00', '9:00', '10:00'
      ];

    var days = [1, 2, 3, 4, 5, 6, 7];
    this.state = {
      data: this.props.data,
      times: times,
      days: days,
      grid: new Array(times.length).fill(0).map(() => new Array(days.length).fill(0)),
      dayStrings : ['MON', 'TU', 'WED', 'TH', 'FRI', "SAT", "SUN"],
    };
  }

  componentWillReceiveProps(nextProps) {

    var newDates = [];
    var inputDates = nextProps.data.eventDates;
    for (var i = 0; i < inputDates.length; i++) {
      newDates.push((parseInt(inputDates[i].month) + 1) + '/' + inputDates[i].day);
    }
    var availabilities = nextProps.data.eventAvailability;
    var newGrid = new Array(this.state.times.length).fill(0).map(() => new Array(newDates.length).fill(0));
    //var newGrid = new Array(14).fill(0).map(() => new Array(3).fill(0));
    for (var i = 0; i < availabilities.length; i++) {
      for (var j = 0; j < availabilities[i].availability.length; j++) {
        for (var k = 0; k < availabilities[i].availability[j].length; k++) {
          newGrid[j][k] += parseInt(availabilities[i].availability[j][k]);
        }
      }
    }

    for (var j = 0; j < newGrid.length; j++) {
      for (var k = 0; k < newGrid[j].length; k++) {
        newGrid[j][k] = newGrid[j][k] + '/' + availabilities.length;
      }
    }
    //console.log(newGrid);


    this.setState({ data: nextProps.data, grid: newGrid});  
  }

  componentDidMount() {

    var newDates = [];
    var inputDates = this.props.data.eventDates;
    for (var i = 0; i < inputDates.length; i++) {
      newDates.push((parseInt(inputDates[i].month) + 1) + '/' + inputDates[i].day);
    }
    var availabilities = this.props.data.eventAvailability;
    var newGrid = new Array(this.state.times.length).fill(0).map(() => new Array(newDates.length).fill(0));
    //var newGrid = new Array(14).fill(0).map(() => new Array(3).fill(0));
    for (var i = 0; i < availabilities.length; i++) {
      for (var j = 0; j < availabilities[i].availability.length; j++) {
        for (var k = 0; k < availabilities[i].availability[j].length; k++) {
          newGrid[j][k] += parseInt(availabilities[i].availability[j][k]);
        }
      }
    }

    for (var j = 0; j < newGrid.length; j++) {
      for (var k = 0; k < newGrid[j].length; k++) {
        newGrid[j][k] = newGrid[j][k] + '/' + availabilities.length;
      }
    }
    //console.log(newGrid);




    this.setState({
      days: new Array(newDates.length).fill(0),
      dayStrings: newDates,
      grid: newGrid
    });


  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = '9:10';
    this.setState({squares: squares});
  }

  toggle(i,j) {
    const grid = this.state.grid.slice();
    grid[i][j] = grid[i][j] ? 0 : 1;
    this.setState({grid: grid});
  } 

  placeholder() {

  }



  render() {
    
    const status = 'EventBoard';
    const { className, ...props } = this.props;
    var curr = this;
    var mapped = this.state.times.map(function (el, x){
      var inner = curr.state.days.map(function (elem, y) {
        return (<Square value={curr.state.grid[x][y]} onClick={() => curr.placeholder()} />);
      });
      return (<div className="board-row"> {curr.state.times[x]} {inner} </div>);
    });

    var single = [0];
    var dayStrings = this.state.dayStrings;

    var dateRow = single.map(function (e, i) {
      var inner = curr.state.days.map(function (elem, y) {
        return (<Square value={dayStrings[y]} onClick={() => curr.placeholder()} />);
      });
      return (<div className="board-row"> {inner} </div>);
    });


    return (
      <div className={classnames('EventBoard', className)} {...props}>
        <div className="status">{status}</div>
        {dateRow}
        {mapped}
      </div>
    );
  }
}


export default EventBoard;