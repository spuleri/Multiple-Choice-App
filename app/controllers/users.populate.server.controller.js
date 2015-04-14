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
 * Populate user with ownedCourses & joinedCourses
 can populate existing documents though:
 http://mongoosejs.com/docs/api.html#document_Document-populate
 */
exports.populateUser = function(req, res) { 
	var user = req.user;
	user.populate('joinedCourses ownedCourses', function(err, user) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			//Now populating owned courses and joined courses 'owner' field.
			Course.populate(user.ownedCourses, {path:'owner', select: 'displayName'}, function(err, poop){
				Course.populate(user.joinedCourses, {path:'owner', select: 'displayName'}, function(err, blah){
					res.jsonp(user);
				});			
			});			
		}
	});
};
