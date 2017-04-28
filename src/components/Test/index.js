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

  constructor(props) {
    super(props);
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
      data: this.props.data,
      times: times,
      days: days,
      grid: new Array(times.length).fill(0).map(() => new Array(days.length).fill(0)),
      dayStrings : ['MON', 'TU', 'WED', 'TH', 'FRI', "SAT", "SUN"],
      inputVal: '',
      loggedIn: false,
      user: '',
      passVal: '',
      auth: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    console.log(this.props.data);

    var newDates = [];
    var inputDates = this.props.data.eventDates;
    for (var i = 0; i < inputDates.length; i++) {
      newDates.push(inputDates[i].month + '/' + inputDates[i].day);
    }
    var userAvail = [];
    var user = this.props.user;
    console.log(user);
    var logged = ((this.props.user) && this.props.loggedEvent === this.props.data.eventName) ? true : false;
    console.log('logged' + logged + " " + this.props.user);
    var availabilities = this.props.data.eventAvailability;
    for (var i = 0; i < availabilities.length; i++) {
      console.log(availabilities[i]);
      console.log(availabilities[i].user);
      if(availabilities[i].user === 'u1') {
        userAvail = availabilities[i].availability;
      }
    }
    this.setState({
      days: new Array(newDates.length).fill(0),
      dayStrings: newDates,
      grid: availabilities.length === 0 ? this.state.grid : userAvail,
      loggedIn: logged,
      user: user,
      auth: this.props.auth
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
    grid[i][j] = grid[i][j] === '1' ? '0' : '1';
    var data = {availability: grid,
                user: this.state.user,
                eventName: this.props.data.eventName};
    $.ajax({
      type: "POST",
      url: '/updateAvailability',
      dataType: 'json',
      data: data,
      success: function(data) {
        console.log(data);
      }.bind(this)
    });
    console.log(grid);
    this.setState({grid: grid});
  } 

  placeholder() {

  }

  handleNameChange(event) {
    this.setState({inputVal: event.target.value});
  }
  handlePassChange(event) {
    this.setState({passVal: event.target.value});
  }

  handleSubmit(event){
    console.log(event);
    //console.log(this.state.inputVal);
    //console.log(JSON.stringify(event));


    event.preventDefault();

  }

  handleLogin(event){
    console.log(event);
    console.log('login');
    var data = {
      user: this.state.inputVal,
      pass: this.state.passVal,
      eventName: this.props.data.eventName
    };
    $.ajax({
      url: '/loginForm',
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: data,
      success: function(data) {
        console.log(data);
        console.log('loginsucceeded');
        var newGrid = this.state.grid;
        var availabilities = this.props.data.eventAvailability;
        for (var i = 0; i < availabilities.length; i++) {
          console.log(availabilities[i]);
          console.log(availabilities[i].user);
          if(availabilities[i].user === data.user) {
            newGrid = availabilities[i].availability;
          }
        }
        this.setState({
          user: data.user,
          loggedIn: true,
          grid: newGrid,
          passVal: ''
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("GOT AN ERROR?");
        console.log(err);
      }.bind(this)
    })
  }

  handleRegister(event){
    console.log('Register');

    var data = {
      user: this.state.inputVal,
      pass: this.state.passVal,
      eventName: this.props.data.eventName
    };
    $.ajax({
      url: '/registerForm',
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: data,
      success: function(data) {
        console.log(data);
        console.log('registersucceeded');
        var newGrid = this.state.grid;
        var availabilities = this.props.data.eventAvailability;
        for (var i = 0; i < availabilities.length; i++) {
          console.log(availabilities[i]);
          console.log(availabilities[i].user);
          if(availabilities[i].user === data.user) {
            newGrid = availabilities[i].availability;
          }
        }
        this.setState({
          user: data.user,
          passVal: '',
          loggedIn: true
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('error');
        console.log(err);
      }.bind(this)
    })


  }

  fillClick() {
    $.ajax({
      url: '/data', //this.props.url,
      dataType: 'json',
      cache: false,
      type: 'POST',
      data: { dates: this.props.data.eventDates },
      success: function(data) {
        console.log(data);
        var events = data.message;
        const grid = this.state.grid.slice();
        var eventDates = this.props.data.eventDates;
        console.log(this.state.grid);

        function indexOf(event, eventDates) {
          for (var i = 0; i < eventDates.length; i++) {
            if(event.startDay == eventDates[i].day && event.month == eventDates[i].month) {
              return i;
            }
          }
          return -1;
        }

        for (var i = 0; i < events.length; i++) {
          var idx = indexOf(events[i], eventDates);
          if(idx >= 0) {
            for (var j = events[i].startHour; j < events[i].endHour; j++) {
              grid[j - 9][idx] = '1';
            }
          }

        }
        this.setState({ grid: grid });

        /*

        currSelected.sort(function(x, y) {
        if (y.month !== x.month) {
          return x.month - y.month;
        } else {
          return x.day - y.day;
        }
      });
      */

        /*
        const grid = this.state.grid.slice();
        var events = data.message;
        for (var i = 0; i < events.length; i++) {
          for (var j = events[i].startHour; j < events[i].endHour; j++) {
            grid[j - 9][events[i].startDay] = '1';
          }
        }
        this.setState({ grid: grid });
        */
      }.bind(this),
      error: function(xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
        console.log(err);
      }.bind(this)
    });

  }


  render() {
    const status = 'FILLBOARD';
    const { className, ...props } = this.props;
    var curr = this;
    var mapped = this.state.times.map(function (el, x){
      var inner = curr.state.days.map(function (elem, y) {
    	  return (<Square value={curr.state.grid[x][y]} onClick={() => curr.toggle(x, y)} />);
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
      <div className={classnames('Board', className)} {...props}>
        <a href="/auth/google">Sign In with Google</a>
        <div className="status">{status}</div>
        {this.state.loggedIn ? 
        <div id='board-container'>
        {dateRow}
        {mapped}
        <a href="/logout">Logout</a>
        {!this.state.auth ? 
        <p>
        <a href="/auth/google">Sign In with Google</a>
        </p>
        :
        <button className={classnames('Square', className)} {...props} onClick={() => this.fillClick()}>
        FILL
      </button>
       }
      </div >: 
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" class="form-control" value={this.state.value} onChange={this.handleNameChange}/>
            <input type="password" name="password" class="form-control" value={this.state.value} onChange={this.handlePassChange}/>
          </label>
          <button type="button" value="Login" onClick={() => this.handleLogin()}>Login</button>
          <button type="button" value="Register" onClick={() => this.handleRegister()}>Register</button>
        </form>
        }
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
export default Board;
