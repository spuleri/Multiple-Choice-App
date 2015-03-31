'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course');
/**
 * Globals
 */
var user, course, quiz, question, answer;

/**
 * Unit tests
 */
describe('Course Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			course = new Course({
				name: 'Course Name',
				owner: user._id
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return course.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			course.name = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

    describe('Quiz Unit Tests', function(done) {
        it('should be able to save course with added quizzes', function(done) {
            course.quizzes = [
                { name: 'quiz1' },
                { name: 'quiz2' },
                { name: 'quiz3' }
            ];
            return course.save(function(err) {
                should.not.exist(err);
                done();
            });

        });

        it('As well as questions on a quiz', function(done) {
            course.quizzes = [
                { name: 'quiz1' },
                { name: 'quiz2' },
                { name: 'quiz3' }
            ];
            course.quizzes[0].questions = [
                { title: 'First Question:', description: 'X + 1 = B. True, or False? (30 points)' }
            ];
            return course.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('As well as answers on a question', function(done) {
            course.quizzes = [
                { name: 'quiz1' },
                { name: 'quiz2' },
                { name: 'quiz3' }
            ];
            course.quizzes[0].questions = [
                { title: 'First Question:', description: 'X + 1 = B. True, or False? (30 points)' }
            ];
            course.quizzes[0].questions[0].answers = [
                { name: 'B doesn\'t exist', valid: false },
                { name: 'No', valid: true },
                { name: 'Insufficient Evidence', valid: false },
                { name: 'We\'re not looking at it from the right dimensional perspective', valid: true }
            ];
            return course.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it ('should be able to show an error when creating a quiz without a quiz name', function(done) {
            course.quizzes = [
                { name: '' }
            ];
            return course.save(function(err) {
                should.exist(err);
                done();
            });            
        });

        it ('should be able to show an error when creating a quiz with a blank question', function(done) {
            course.quizzes = [
                { name: 'quiz1' }
            ];
            course.quizzes[0].questions = [
                { title: 'First Question:', description: '' }
            ];
            return course.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it ('should be able to show an error when creating a quiz with a blank answer', function(done) {
            course.quizzes = [
                { name: 'quiz1' },
                { name: 'quiz2' },
                { name: 'quiz3' }
            ];
            course.quizzes[0].questions = [
                { title: 'First Question:', description: 'X + 1 = B. True, or False? (30 points)' }
            ];
            course.quizzes[0].questions[0].answers = [
                { name: 'B doesn\'t exist', valid: false },
                { name: 'No', valid: true },
                { name: 'Insufficient Evidence', valid: false },
                { name: '', valid: true }
            ];
            return course.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

	afterEach(function(done) { 
		Course.remove().exec();
		User.remove().exec();

		done();
	});
});
