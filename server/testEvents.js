var Events = require('./Events');

console.log('here');
/*
Events.addEvent('event3', [1,3,4], function(err){
	if(err) console.log(err);
	else {
		console.log("SUCCESS");
	}
});


Events.findOne({eventName: 'event3'}, function (err,event) {
	console.log(err);
	console.log(event);
});
Events.find({eventName: 'event2'}, function (err,event) {
	console.log(err);
	console.log(event);
});
*/
/*
Events.find({eventName: 'event1'}, function (err,event) {
			console.log(err);
			console.log(event);
});
*/
/*
Events.addUser('event1', 'u1', function(err, res){
	if(err) console.log(err);
	else {
		console.log("SUCCESS");
		console.log(res);
		Events.find({eventName: 'event1'}, function (err,event) {
			console.log(err);
			console.log(event);
		});
	}


});
*/


// Events.updateAvailability('event1', 'u1', [1,1,1], function (err, resp){
// 	console.log(resp);
// })




Events.findOne({eventName: 'event1'}, function (err, event){
  console.log(event.eventAvailability);
});
