'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Course = mongoose.model('Course');

/**
 * Global variables
 */
var prof, student, course, storedQuiz;

describe('Storing User Answers Tests:\n', function() {
   beforeEach(function(done) {
       prof = new User({
           firstName: 'Full',
           lastName: 'Name',
           displayName: 'Full Name',
           email: 'test@test.com',
           username: 'username',
           password: 'password',
           roles: ['admin']
       });

       student = new User({
           firstName: 'new',
           lastName: 'Name',
           displayName: 'Student',
           email: 'test@test.com',
           username: 'username',
           password: 'password',
           roles: ['student'],
           answers: []
       });

       prof.save(function() {
           course = new Course({
               name: 'Test Course',
               owner: prof._id,
               quizzes: [{
                   name: 'Test Quiz',
                   questions: [
                       {
                           description: 'My prob!',
                           answers: [
                               {
                                   name: 'Answer 1',
                                   valid: false
                               },
                               {
                                   name: 'Answer 2',
                                   valid: false
                               },
                               {
                                   name: 'Answer 3',
                                   valid: true
                               }
                           ]
                       }
                   ]
               }]
           });
           course.save(function(err) {
               if (!err) {
                   student.save(function() {
                       done();
                   });
               }
           }); // Above code saves a professor, then his course, then a student
       });
   });

    it('Store answers that a user provides for a particular quiz', function(done) {
        storedQuiz = {
            quizId: null,
            answers: []
        };
        storedQuiz.quizId = course.quizzes[0]._id;
        storedQuiz.answers = [course.quizzes[0].questions[0].answers[2]._id];

        student.storedAnswers = [storedQuiz];
        student.update(function(err) {
            should.not.exist(err);
            done();
        });
    });
    describe('And then be able to be retrieved and cross-referenced with the course', function() {
        beforeEach(function(done) {

            Course.findOne({name: 'Test Course'}, function (err, courseGet) {
                if (err) {
                    done(err);
                }
                course = courseGet;
                done();
            });
        });


        it('Like so...', function(done) {
            storedQuiz = {
                quizId: null,
                answers: []
            };
            storedQuiz.quizId = course.quizzes[0]._id;
            storedQuiz.answers = [course.quizzes[0].questions[0].answers[2]._id];

            student.storedAnswers = [storedQuiz];
            student.update(function(err) {
                if (err) {
                    done(err);
                }

                Course.findOne({name: 'Test Course'}, function (err, courseGet) {
                    if (err) {
                        done(err);
                    }
                    course = courseGet;

                    (course.quizzes[0]._id).should.match(student.storedAnswers[0].quizId);
                    (course.quizzes[0].questions[0].answers[2]._id).should.match(student.storedAnswers[0].answers[0]);
                    done();
                });
            });
        });
    });
    after(function(done) {
      User.remove().exec();
      done();
    });
});
