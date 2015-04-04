'use strict';
/****
had to put these tests at the end by naming them "userquiz"
so that the user server tests will work properly because for some reason the "After function"
to delete all the users does not work....
*****/
/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Course = mongoose.model('Course'),
    _ = require('lodash'),
    agent = request.agent(app);

/**
 * Global variables
 */
var prof, student1, student2, course, storedQuiz1, storedQuiz2, storedQuiz;

describe('Grading and releasing a quiz:', function() {
   before(function(done) {
       prof = new User({
           firstName: 'Full',
           lastName: 'Name',
           displayName: 'Full Name',
           email: 'test@test.com',
           username: 'username1',
           password: 'password',
           roles: ['admin'],
           ufid: '88888888',
           gatorlink: 'crazyman',
           provider: 'local'

       });

       student1 = new User({
           firstName: 'first',
           lastName: 'guy',
           displayName: 'student1',
           email: 'test@test.com',
           username: 'username2',
           password: 'password',
           roles: ['user'],
           storedAnswers: [],
           ufid: '88888888',
           gatorlink: 'crazyman',
           provider: 'local'
       });
       student2 = new User({
           firstName: 'second',
           lastName: 'guy',
           displayName: 'Student2',
           email: 'test2@test.com',
           username: 'username3',
           password: 'password',
           roles: ['user'],
           storedAnswers: [],
           ufid: '88888888',
           gatorlink: 'crazyman',
           provider: 'local'
       });
       prof.save(function() {
           course = new Course({
               name: 'Test Course',
               owner: prof._id,
               quizzes: [{
                   name: 'Test Quiz',
                   released: false,
                   questions: [
                       {
                           description: 'first prob!',
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
                       },
                       {
                           description: 'second prob!',
                           answers: [
                               {
                                   name: 'Answer 1',
                                   valid: true
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
               }],
               roster: [student1._id, student2._id]
           });
           course.save(function(err) {
               if (!err) {
                  student1.save(function(err){
                    if(!err){
                      student2.save(function(err){
                        if(!err){
                          done();
                        } else console.log(err);
                      });
                    } 
                    else console.log(err);
                  });
          
               }
               else console.log(err);
           }); // Above code saves a professor, then a course, then 2 students
       });
   });

    describe('Students should be able to answer questions and a professor should be able to choose to grade a Quiz', function() {
      it('Both students should be able to save 2 answers to questions in their storedAnswers array', function(done){
        storedQuiz1 = {
            quizId: null,
            answers: []
        };
        storedQuiz2 = {
            quizId: null,
            answers: []
        };
        storedQuiz1.quizId = course.quizzes[0]._id;
        storedQuiz2.quizId = course.quizzes[0]._id;
        //this student should get both questions correct with a score of 2
        storedQuiz1.answers = [course.quizzes[0].questions[0].answers[2]._id, course.quizzes[0].questions[1].answers[0]._id ];
        //this student should only get the first question right with a score of 1
        storedQuiz2.answers = [course.quizzes[0].questions[0].answers[2]._id, course.quizzes[0].questions[1].answers[1]._id ];

        student1.storedAnswers = [storedQuiz1];
        student2.storedAnswers = [storedQuiz2];

        //saving both students to update them
        student1.save(function(err) {
            should.not.exist(err);
            student2.save(function(err){
              should.not.exist(err);
              done();
            });
        });
        student1.storedAnswers[0].answers.length.should.equal(2);
        student2.storedAnswers[0].answers.length.should.equal(2);


      });

      it('releaseAndGrade should grade every student\'s quiz in the course roster and the quiz should then be marked as released ', function(done){
        //need to do cuz async code.
        //my function responds but the rest of the code is asynchronously updating each user..
        this.timeout(5000);
        setTimeout(done, 3000);

        Course.findOne({name: 'Test Course'}, function (err, courseGet) {
            if (err) {
                done(err);
            }
            course = courseGet;
           // course.roster.length.should.equal(2);
        });

        var quiz = course.quizzes[0];

        var quizAndCourse = {
          quiz: quiz,
          course: course
        };

        //calling the release and grade method with the specified quiz and course needed to grade
        agent.post('/courses/quizzes')
          .send(quizAndCourse)
          .expect(200)
          .end(function(err, res) {
            // Handle signin error
            if (err) done(err);
            
            //checking the quiz has been set to released!
            res.body.quizzes[0].released.should.equal(true);
            //done();

            
            
          });

      });
      it('The 2 students should now have the correct scores in their storedAnswers array', function(done){

        //checking student1 now has score 2/2
        User.findOne({
          _id: student1._id
        }).exec(function(err, user1) {
          if (err) console.log(err);
          if (!user1) console.log('Failed to load user1 ' + student1._id);
          //console.log(user1);
          user1.storedAnswers[0].should.have.property('score', 2);

          //checking student 2 now has score 1/2
          User.findOne({
            _id: student2._id
          }).exec(function(err, user2) {
            if (err) console.log(err);
            if (!user2) console.log('Failed to load user2 ' + student2._id);
            //console.log(user2);
            user2.storedAnswers[0].should.have.property('score', 1);
            done();
            });

          });


      });


    });//describe block ends ehre

  after(function(done) {
    User.remove().exec();
    done();
  });

});
