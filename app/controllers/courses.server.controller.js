
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	_ = require('lodash');

/**
 * Create a Course
 */
exports.create = function(req, res) {
	console.log(req.user.displayName);
	console.log(typeof req.user.roles);
	console.log(req.user.roles);
	//need to use single != bcs not the same type.
	//cant use single != bcs using strict. roles is of type object^
	//needs fixing
	if(req.user.roles !== 'user') {

		console.log('past the if statment');

		var course = new Course(req.body);
		course.user = req.user;

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
 * Update a Course
 */
exports.update = function(req, res) {
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
};

/**
 * Delete an Course
 */
exports.delete = function(req, res) {
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
};

/**
 * List of Courses
 */
exports.list = function(req, res) { 
	Course.find().sort('-created').populate('user', 'displayName').exec(function(err, courses) {
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
	Course.findById(id).populate('user', 'displayName').exec(function(err, course) {
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
	if (req.course.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
