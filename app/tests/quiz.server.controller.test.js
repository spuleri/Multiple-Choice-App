// 'use strict';

// /**
//  * Module dependencies.
//  */
// var should = require('should'),
//     request = require('supertest'),
//     app = require('../../server'),
//     mongoose = require('mongoose'),
//     User = mongoose.model('User'),
//     Course = mongoose.model('Course'),
//     _ = require('lodash'),
//     agent = request.agent(app);

// /**
//  * Global variables
//  */
// var prof, student1, student2, course, storedQuiz1, storedQuiz2, storedQuiz;

// describe('Grading and releasing a quiz:', function() {
//    beforeEach(function(done) {
//        prof = new User({
//            firstName: 'Full',
//            lastName: 'Name',
//            displayName: 'Full Name',
//            email: 'test@test.com',
//            username: 'username1',
//            password: 'password',
//            roles: ['admin'],
//            ufid: '8888-8888',
//            gatorlink: 'crazyman',
//            provider: 'local'

//        });

//        student1 = new User({
//            firstName: 'first',
//            lastName: 'guy',
//            displayName: 'first guy',
//            email: 'test@test.com',
//            username: 'username2',
//            password: 'password',
//            roles: ['user'],
//            storedAnswers: [],
//            ufid: '8888-8888',
//            gatorlink: 'crazyman',
//            provider: 'local'
//        });
//        student2 = new User({
//            firstName: 'second',
//            lastName: 'guy',
//            displayName: 'Student',
//            email: 'test2@test.com',
//            username: 'username3',
//            password: 'password',
//            roles: ['user'],
//            storedAnswers: [],
//            ufid: '8888-8888',
//            gatorlink: 'crazyman',
//            provider: 'local'
//        });
//        prof.save(function() {
//            course = new Course({
//                name: 'Test Course',
//                owner: prof._id,
//                quizzes: [{
//                    name: 'Test Quiz',
//                    questions: [
//                        {
//                            description: 'first prob!',
//                            answers: [
//                                {
//                                    name: 'Answer 1',
//                                    valid: false
//                                },
//                                {
//                                    name: 'Answer 2',
//                                    valid: false
//                                },
//                                {
//                                    name: 'Answer 3',
//                                    valid: true
//                                }
//                            ]
//                        },
//                        {
//                            description: 'second prob!',
//                            answers: [
//                                {
//                                    name: 'Answer 1',
//                                    valid: true
//                                },
//                                {
//                                    name: 'Answer 2',
//                                    valid: false
//                                },
//                                {
//                                    name: 'Answer 3',
//                                    valid: true
//                                }
//                            ]
//                        }
//                    ]
//                }],
//                roster: [student1._id, student2._id]
//            });
//            course.save(function(err) {
//                if (!err) {
//                   student1.save(function(err){
//                     if(!err){
//                       student2.save(function(err){
//                         if(!err){
//                           done();
//                         } else console.log(err);
//                       })
//                     } 
//                     else console.log(err);
//                   });
          
//                }
//                else console.log(err);
//            }); // Above code saves a professor, then a course, then 2 students
//        });
//    });

//     describe('Both students should be able to store answers to 2 questions in their storedAnswers array', function() {
//       beforeEach(function(done){
//         storedQuiz1 = {
//             quizId: null,
//             answers: []
//         };
//         storedQuiz2 = {
//             quizId: null,
//             answers: []
//         };
//         storedQuiz1.quizId = course.quizzes[0]._id;
//         storedQuiz2.quizId = course.quizzes[0]._id;
//         storedQuiz1.answers = [course.quizzes[0].questions[0].answers[2]._id, course.quizzes[0].questions[0].answers[0]._id ];
//         storedQuiz2.answers = [course.quizzes[0].questions[0].answers[2]._id, course.quizzes[0].questions[0].answers[1]._id ];

//         student1.storedAnswers = [storedQuiz1];
//         student2.storedAnswers = [storedQuiz2];

//         student1.update(function(err) {
//             should.exist(err);
//             student2.update(function(err){
//               should.exist(err);
//             });
//         });
//         student1.storedAnswers[0].answers.length.should.equal(2);
//         student2.storedAnswers[0].answers.length.should.equal(2);

//         User.find({}, function(err, users) {
//           //console.log(users);
//           //users.should.have.length(3);
//           done();
//         });

//         //done();
//       });

//       it('The professor should be able to call releaseAndGrade and grade the course rosters quiz answers', function(done){

//         Course.findOne({name: 'Test Course'}, function (err, courseGet) {
//             if (err) {
//                 done(err);
//             }
//             course = courseGet;
//             console.log('the course roster:');
//             console.log(course.roster);
//             course.roster.length.should.equal(2);
//         });

//         var quiz = course.quizzes[0];

//         var quizAndCourse = {
//           quiz: quiz,
//           course: course
//         };

//         User.findOne({
//           _id: student1._id
//         }).exec(function(err, user) {
//           if (err) console.log(err);
//           if (!user) console.log('Failed to load User ' + student1._id);
//           //console.log(user);
//           console.log('@@@@@@@@@@@@@@@@');
//           user.should.have.property('storedAnswers').with.lengthOf(2);
//           done()
//           });




//         // agent.post('/courses/quizzes')
//         //   .send(quizAndCourse)
//         //   .expect(200)
//         //   .end(function(err, res) {
//         //     // Handle signin error
//         //     if (err) done(signinErr);

//         //     console.log(res.body);
//         //     // Save a new Course
//         //     // agent.post('/courses')
//         //     //   .send(course)
//         //     //   .expect(400)
//         //     //   .end(function(courseSaveErr, courseSaveRes) {
//         //     //     // Set message assertion
//         //     //     (courseSaveRes.body.message).should.match('Please fill Course name');
                
//         //     //     // Handle Course save error
//         //     //     done(courseSaveErr);
//         //     //   });
//         //   });

//       });

//     });
//     // describe('And then be able to be retrieved and cross-referenced with the course', function() {
//     //     beforeEach(function(done) {

//     //         Course.findOne({name: 'Test Course'}, function (err, courseGet) {
//     //             if (err) {
//     //                 done(err);
//     //             }
//     //             course = courseGet;
//     //             done();
//     //         });
//     //     });


//     //     it('Like so...', function(done) {
//     //         storedQuiz = {
//     //             quizId: null,
//     //             answers: []
//     //         };
//     //         storedQuiz.quizId = course.quizzes[0]._id;
//     //         storedQuiz.answers = [course.quizzes[0].questions[0].answers[2]._id];

//     //         student.storedAnswers = [storedQuiz];
//     //         student.update(function(err) {
//     //             if (err) {
//     //                 done(err);
//     //             }

//     //             Course.findOne({name: 'Test Course'}, function (err, courseGet) {
//     //                 if (err) {
//     //                     done(err);
//     //                 }
//     //                 course = courseGet;

//     //                 (course.quizzes[0]._id).should.match(student.storedAnswers[0].quizId);
//     //                 (course.quizzes[0].questions[0].answers[2]._id).should.match(student.storedAnswers[0].answers[0]);
//     //                 done();
//     //             });
//     //         });
//     //     });
//     // });
//   after(function(done) {
//     User.remove().exec();
//     done();
//   });

// });
