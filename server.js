'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.get('server').listen(config.port);

// tack out socket instance from the app container
var io = app.get('socketio'); 
io.sockets.on('connection', function(socket){

	console.log('connected brooo!');
	socket.on('test socket', function(data){
		console.log('recieved?');
		io.sockets.emit('send test back', data);
	}); // emit an event for all connected clients

	socket.on('start-question', function(question){
		io.sockets.emit('send-question-to-all', question);
	});

	//on recieving current time from client
	socket.on('current-time', function(time){
		//send curr time back to all clients
		io.sockets.emit('current-time-from-server', time);
	});
	socket.on('end-question', function(question){
		io.sockets.emit('remove-question', question);
	});
});



// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);



