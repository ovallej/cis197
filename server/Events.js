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

/*
eventSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});
*/

/*
eventSchema.statics.addUser = function(username, password, cb) {
  var newUser = new this({ username: username, password: password});
  newUser.save(cb);
}
*/

eventSchema.statics.addEvent = function(eventName, eventDates, cb) {
  var newEvent = new this({ eventName: eventName, eventDates: eventDates, users: [], eventAvailability: [] });
  newEvent.save(cb);
}

eventSchema.statics.addUser = function(eventName, user, cb) {
  this.findOne({ eventName: eventName }, function(err, event) {
    if (!event) cb(false);
    else {
      event.users.push(user);
      event.eventAvailability.push({ user: user, availability: new Array(14).fill(0).map(() => new Array(event.eventDates.length).fill(0)) });
      event.save(function(err) {
        if (err) throw err;
        console.log('event successfully updated');
        cb(true);
      });
    }
  });
}

eventSchema.statics.updateAvailability = function(eventName, user, availability, cb) {
  var test = this;
  this.findOne({ eventName: eventName }, function(err, event) {
    if (!event) cb(false);
    else {
      console.log(event);
      console.log('avail Lenght : ' + event.eventAvailability.length);
      for (var i = 0; i < event.eventAvailability.length; i++) {
        if (event.eventAvailability[i].user === user) {
          console.log(event.eventAvailability[i])
          console.log(availability);
          event.eventAvailability[i].availability = availability;
          console.log(event.eventAvailability[i])
          test.update({ _id: event.id }, { $set: { eventAvailability: event.eventAvailability }}, function (err){
            console.log("IN TEST");
          });
          /*
          event.save(function(err) {
            if (err) throw err;
            console.log('event availability successfully updated');
            cb(true);
          });
          */
          break;
        }
      }

    }
  });


}


/*
eventSchema.statics.checkIfLegit = function(username, password, cb) {
  this.find({ username: username }, function(err, user) {
    if (!user) cb('no user');
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) return cb(err);
        cb(null, isRight);
      });
    };
  });
}
*/

module.exports = mongoose.model('Events', eventSchema);
