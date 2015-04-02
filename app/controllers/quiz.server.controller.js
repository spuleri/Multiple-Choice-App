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
			_id: userID
		}).exec(function(err, user) {
			if (err) console.log(err);
			if (!user) console.log('Failed to load User ' + userID);

			user.storedAnswers.forEach(function(takenQuiz){
				//going thru the array of quizzes that
				//the user has taken.

				//looking for the one who's id matches the quiz we are grading
				if(takenQuiz.quizId === quiz._id){
					//
					var score = 0;
					for(var i = 0; i < quiz.questions.length; ++i){

						//getting array of CORRECT answer IDs for this question using
						//lodash where: https://lodash.com/docs#where

						var correctAnswers = _.pluck(_.where(quiz.questions[i].answers, {'valid': true }), '_id');

						//checking if the users's answer for this question matches any of the correct answers for this question
						if( _.some(correctAnswers, takenQuiz.answers[i]._id) ){
							//if so, increase score
							score++;
						}

						
					}
					//setting the actuall users score in the "QuizAnswers" schema.
					//for this quiz
					takenQuiz.score = score;
					//updating and saving the user
					user.updated = Date.now();
					user.save(function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							console.log('user was updated');
							//the user was succesfully updated, do nothing..
						}
					});
				}

			});

			console.log(user.storedAnswers.length);
			
		});
	});
	
	//marking quiz as released and sending back course
	course.quizzes.forEach(function(quizInCourse){
		if(quizInCourse._id === quiz._id){
			//releasing the quiz we graded for every user
			quizInCourse.released = true;
			//responding back with course with the "released quiz"
			//every user should have their score now in thier storedAnswers array
			res.jsonp(course);
		}
	});

};