
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Course
 */
exports.create = function(req, res) {
	if(req.user.roles[0] === 'admin') {

		var course = new Course(req.body);
		course.owner = req.user._id;

		course.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(course);
			}
		});
	}
	else{
		console.log('You are not an admin, therefore you cannot create a course');
	}
};

/**
 * Show the current Course
 */
exports.read = function(req, res) {
	res.jsonp(req.course);
};

/**
 * Show course's quizzes
 */
exports.readQuizzes = function(req, res) {
    res.jsonp(req.course.quizzes);
};

/**
 * Update a Course
 */
 /*
exports.update = function(req, res) {	

	if(req.user.roles[0] === 'admin') {
		var course = req.course ;

		course = _.extend(course , req.body);

		course.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(course);
			}
		});
	}
	else {console.log('You are not an admin and cannot update a course');}
};
*/


exports.update = function(req, res) {	
	var course = req.course;
	var user = req.user;

	// Otherwise, prof will join the roster everytime he updates
	if (user.id.toString() !== course.owner._id.toString())
		course.roster.push(user.id);

	if(user.id.toString() === course.owner._id.toString()) {
		course = _.extend(course , req.body);

	}
	else {console.log('You are not an admin and cannot update a course');}
	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};




/**
 * Delete an Course
 */
exports.delete = function(req, res) {

	if(req.user.roles[0] === 'admin') {
		var course = req.course ;

		course.remove(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(course);
			}
		});
	}
	else {console.log('You are not an admin and cannot delete a course');}

};

/**
 * List of Courses
 */
exports.list = function(req, res) { 
	Course.find().sort('-created').populate('owner', 'displayName').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

/**
 * Course middleware
 */
exports.courseByID = function(req, res, next, id) {
	Course.findById(id).populate('owner', 'displayName').exec(function(err, course) {
		if (err) return next(err);
		if (! course) return next(new Error('Failed to load Course ' + id));
		req.course = course ;
		next();
	});
};

/**
 * Course authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.course.owner.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};



/**
 * Update a Course
 */
/*
exports.updateRoster = function(req, res) {
	var course = req.course;
	course.roster.push(req.user.id);
	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
	
};
*/