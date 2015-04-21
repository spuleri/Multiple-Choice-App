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

var Course = mongoose.model('Course');

// tack out socket instance from the app container
var io = app.get('socketio'); 
io.sockets.on('connection', function(socket){

	socket.on('test socket', function(data){
		io.sockets.emit('send test back', data);
	}); // emit an event for all connected clients

	socket.on('start-question', function(question, index, courseId){
		io.sockets.emit('send-question-to-all', question, index, courseId);
	});

    socket.on('send-answer', function(ansId, userId, courseId) {
        io.sockets.emit('receive-student-answer', ansId, userId, courseId);
    });

	//on recieving current time from client
	socket.on('current-time', function(time, courseId){
		//send curr time back to all clients
		io.sockets.emit('current-time-from-server', time, courseId);
	});
	socket.on('end-question', function(question, courseId){
		io.sockets.emit('remove-question', question, courseId);
	});
    socket.on('join-course', function(courseId, userId) {
        Course.findById(courseId).exec(function(err, course) {
            if (err) socket.emit('join-status', userId, false);
            if (!course) socket.emit('join-status', userId, false);
            var joined = false;
            for (var i in course.roster) {
                if (course.roster[i] === userId) {
                    joined = true;
                    console.log('Already joined, betch');
                }
            }
            if (!joined)
                course.roster.push(userId);
            course.save(function(err) {
                if (err)
                    io.sockets.emit('join-status', userId, false);
                else {
                    io.sockets.emit('join-status', userId, true);
                    console.log('Success!');
                }
            });
        });
    });
});



// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);



