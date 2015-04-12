'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	User = mongoose.model('User'),
	_ = require('lodash');


//Recieves a quiz that needs to be released
//and the course that it is in.
//this function goes thru every user in the courses roster, grades their Quiz that needs grading,
//then assigns them a score for that quiz, saves the updated user
//then updates the quiz and sets released to true and responds back with the course
exports.releaseQuiz = function(req, res) {

	var quiz = req.body.quiz;
	var course = req.body.course;

	//going thru each user in the roster and grading their answers, for each 
	//question in the quiz
	course.roster.forEach(function(userID){
		User.findOne({
			//need to do ._id because the roster is an array of user objects now
			//cuz its being populated in the courseByID function
			_id: userID
		}).exec(function(err, user) {
			if (err) console.log(err);
			//console.log(user);
			if (!user) console.log('Failed to load User ' + userID);

			user.storedAnswers.forEach(function(takenQuiz){
				//going thru the array of quizzes that
				//the user has taken.

				//looking for the one who's id matches the quiz we are grading
				if(takenQuiz.quizId.toString() === quiz._id.toString()){
					// console.log('found match of quizId');
					var score = 0;
					for(var i = 0; i < quiz.questions.length; ++i){

						//getting array of CORRECT answer IDs for this question using
						//lodash where: https://lodash.com/docs#where

						var correctAnswers = _.pluck(_.where(quiz.questions[i].answers, {'valid': true }), '_id');
						// console.log(correctAnswers);
						// console.log('my answer for this question is: ' + takenQuiz.answers[i]);

						//checking if the users's answer for this question matches any of the correct answers for this question						
						for(var j = 0; j < correctAnswers.length; ++j){
							if( correctAnswers[j].toString() === takenQuiz.answers[i].toString() ){
								//if so, increase score
								// console.log('a correct answer was found: ' + takenQuiz.answers[i]);
								score++;
							}
						}

						
					}
					//setting the actuall users score in the "QuizAnswers" schema.
					//for this quiz
					takenQuiz.score = score;
					//console.log('quiz score is: ' + takenQuiz.score);
					//updating and saving the user
					user.updated = Date.now();
					user.save(function(err) {
						if (err) {
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}
					});
				}

			});
			
		});
	});

	//finding the correct course and updating it.
	Course.findOne({
		_id: course._id
	}).exec(function(err, course) {
		if (err) console.log(err);
		if (!course) console.log('Failed to load course ' + course._id);

		//marking quiz as released and sending back course
		for(var i = 0; i < course.quizzes.length; ++i){
			
			if(course.quizzes[i]._id.toString() === quiz._id.toString()){
				//releasing the quiz we graded for every user
				course.quizzes[i].released = true;
				break;
			}
		}
		//saving the updated course and then
		//responding back with course with the "released quiz"
		//every user should have their score now in thier storedAnswers array
		course.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(course);
			}
		});

	});


};
