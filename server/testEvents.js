var Events = require('./Events');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newDb');
//events: test1, event1
// console.log('here');

// Events.addEvent('event3', [1, 3, 4], function(err) {
//   if (err) console.log(err);
//   else {
//     console.log("SUCCESS");
//   }
// });


// Events.findOne({ eventName: 'event3' }, function(err, event) {
//   console.log(err);
//   console.log(event);
// });
// Events.find({ eventName: 'event2' }, function(err, event) {
//   console.log(err);
//   console.log(event);
// });

// Events.findOne({ eventName: 'test1' }, function(err, event) {
//     console.log(event);
//   });


// Events.addUser('test1', 'u1', function(err, res) {
//   if (err) console.log(err);
//   else {
//     console.log("SUCCESS");
//     console.log(res);
//     Events.find({ eventName: 'event1' }, function(err, event) {
//       console.log(err);
//       console.log(event);
//     });
//   }
// });




// Events.updateAvailability('event1', 'u1', [1,1,1], function (err, resp){
// 	console.log(resp);
// })



// Events.find(function(err, event) {
//   console.log('event');
// });


// Events.addUser('event1', 'u1')

Events.findOne({eventName: 'test1'}, function (err, event){
  console.log(event);
  console.log(event.eventAvailability);
});

// Events.findUser('test1', 'u1', function(data) {
//   console.log('u1');
//   console.log(data);
// });

// Events.findUser('test1', 'u2', function(data) {
//   console.log('u2');
//   console.log(data);
// });
