# meetup
cis 197 final proj

To run:
npm install
npm run build 
npm server

Go to localhost:3000 and check it out!

Current links/pages:

localhost:3000/login
-Only the google auth login is working right now, once you authenticate it takes you to
/game


localhost:3000/game
-currently used totest user input from google fill, if you are authenticated it will fill in your google calendar data from the week of 4/17 into the calendar 

localhost:3000/calendar
-lets you create an event, choose the dates and give it a name (gets pushed to mongodb but the redirect is not working so far)


TODO:
next is get localhost:3000/event/:eventid
getting that working somehow...

Database:
Mongodb:
check Events.js and User.js in server/
-pretty much completed