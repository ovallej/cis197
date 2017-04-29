var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/newDb');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var eventSchema = new Schema({
  eventName: { type: String, required: true, unique: true },
  eventDates: { type: Array, required: true },
  users: { type: Array, required: false },
  eventAvailability: { type: Array, required: false }
});

mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: %s', err);
});

eventSchema.statics.addEvent = function (eventName, eventDates, cb) {
  //var avail = new Array(14).fill(0).map(() => new Array(eventDates.length).fill(0));
  var newEvent = new this({ eventName: eventName, eventDates: eventDates, users: [], eventAvailability: [] });
  newEvent.save(cb);
}

eventSchema.statics.addUser = function (eventName, user, cb) {
  console.log('BEFORE FIND');
  console.log(eventName);
  //console.log(this);
  this.findOne({ eventName: eventName }, function (err, event) {
    console.log(err);
    console.log(event);
    console.log('wft');
    if (!event) {
      console.log('no event');
      cb(false);
    } else {
      event.users.push(user);
      event.eventAvailability.push({ user: user, availability: new Array(14).fill(0).map(() => new Array(event.eventDates.length).fill(0)) });
      event.save(function (err) {
        if (err) throw err;
        console.log('event successfully updated');
        cb(event);
      });
    }
  });
}

function updateMatrix(m1, m2, m3) {
  //calculates m1 - m2 + m3
  //assumes they all match in sizes
  var totalDays = m1[0].length ? m1[0].length : 0;
  var outputMatrix = new Array(m1.length).fill(0).map(() => new Array(totalDays).fill(0));
  new Array(14).fill(0).map(() => new Array(eventDates.length).fill(0));
  for (var i = 0; i < m1.length; i++) {
    for (var j = 0; j < m1[i].length; j++) {
      outputMatrix[i][j] = m1[i][j] - m2[i][j] + m3[i][j];
    }
  }
  return outputMatrix;
}
eventSchema.statics.updateAvailability = function (eventName, user, availability, cb) {
  var test = this;
  this.findOne({ eventName: eventName }, function (err, event) {
    if (!event) cb(false);
    else {
      for (var i = 0; i < event.eventAvailability.length; i++) {
        if (event.eventAvailability[i].user === user) {
          event.eventAvailability[i].availability = availability;
          test.update({ _id: event.id }, { $set: { eventAvailability: event.eventAvailability } }, function (err) {
            console.log('IN TEST');
            cb(event);
          });
          break;
        }
      }

    }
  });
}

eventSchema.statics.findUser = function (eventName, user, cb) {
  this.findOne({ eventName: eventName }, function (err, event) {
    if (!event) {
      cb(false);
    } else {
      console.log(event);
      for (var i = 0; i < event.users.length; i++) {
        if (event.users[i] === user) {
          cb(event);
        }
      }
      //cb(false);
    }
  });
}



module.exports = mongoose.model('Events', eventSchema);
