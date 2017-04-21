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
  
  constructor() {
    super();
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

class Board extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}

  constructor() {
    super();
    /*
    this.state = {
      times: ['9:00', '9:15', '9:30', '9:45',
        '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15', '11:30', '11:45',
        '12:00', '12:15', '12:30', '12:45',
        '1:00', '1:15', '1:30', '1:45',
        '2:00', '2:15', '2:30', '2:45',
        '3:00', '3:15', '3:30', '3:45',
        '4:00', '4:15', '4:30', '4:45',
        '5:00', '5:15', '5:30', '5:45',
        '6:00', '6:15', '6:30', '6:45',
        '7:00', '7:15', '7:30', '7:45',
        '8:00', '8:15', '8:30', '8:45',
      ],
    * /
    this.state = {
      /*
    times: ['9:00', '9:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30',
      '1:00', '1:30', '2:00', '2:30', '3:00',
      '3:30', '4:00', '4:30', '5:00',
      '5:30', '6:00', '6:30', '7:00',
      '7:30', '8:00', '8:30'
    ],
    */
    var times = ['9:00', '10:00',
        '11:00', '12:00',
        '1:00', '2:00', '3:00',
        '4:00', '5:00',
        '6:00', '7:00',
        '8:00', '9:00', '10:00'
      ];

    var days = [1, 2, 3, 4, 5, 6, 7];
    this.state = {
      times: times,
      days: days,
      grid: new Array(times.length).fill(0).map(() => new Array(days.length).fill(0)),
    };
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

  fillClick() {
    $.ajax({
        url: '/data', //this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          //this.setState({data: data});
          console.log(data);
          const grid = this.state.grid.slice();
          console.log(grid);
          var events = data.message;
          for (var i = 0; i < events.length; i++) {
            console.log(events[i]);
            for (var j = events[i].startHour; j < events[i].endHour; j++) {
              console.log(events[i].startDay);
              console.log(j);
              grid[j-9][events[i].startDay] = 1;
            }
          }
          console.log(grid);
          this.setState({grid: grid});
      }.bind(this),
      error: function(xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
        console.log(err);
      }.bind(this)
    });
  }


  render() {
    const status = 'Next player: X';
    const { className, ...props } = this.props;
    var curr = this;
    var mapped = this.state.times.map(function (el, x){
    	var inner = curr.state.days.map(function (elem, y) {
    		return (<Square value={curr.state.grid[x][y]} onClick={() => curr.toggle(x, y)} />);

    	});
    	return (<div className="board-row"> {curr.state.times[x]} {inner} </div>);
    });

    var single = [0];
    var dayStrings = ['MON', 'TU', 'WED', 'TH', 'FRI', "SAT", "SUN"]
    var dateRow = single.map(function (e, i) {
    	var inner = curr.state.days.map(function (elem, y) {
    		return (<Square value={dayStrings[elem-1]} onClick={() => curr.placeholder()} />);
    	});
      return (<div className="board-row"> {inner} </div>);
    });


    return (
      <div className={classnames('Board', className)} {...props}>
        <div className="status">{status}</div>
        {dateRow}
        {mapped}
        <button className={classnames('Square', className)} {...props} onClick={() => this.fillClick()}>
        FILL
      </button>
      </div>
    );
  }
}

class Game extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {}

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('Game', className)} {...props}>
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
        </div>
      </div>
    );
  }
}

export default Game;
