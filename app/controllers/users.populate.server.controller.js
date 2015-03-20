'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	User = mongoose.model('User'),
	_ = require('lodash');


/*Old way of doing it, by actually querying the database and populating the model
*/
// exports.populateUser = function(req, res) { 
// 	var user = req.user;
// 	User.findOne({
// 		_id: user.id //popul8in user
// 	}).populate('joinedCourses').populate('ownedCourses').exec(function(err, user) {

// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			console.log('hi');
// 			User.populate('owner', 'displayName',function(err, user){
// 				// Remove sensitive data
// 				user.password = undefined;
// 				user.salt = undefined;
// 				res.jsonp(user);
// 			});
// 		}
// 	});
// };


/**
 * Populate user with ownedCourses & joinedCourses
 can populate exsisitng documents though: 
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