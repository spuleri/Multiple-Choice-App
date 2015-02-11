'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, course;

/**
 * Course routes tests
 */
describe('Course CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Course
		user.save(function() {
			course = {
				name: 'Course Name'
			};

			done();
		});
	});

	it('should be able to save Course instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Course
				agent.post('/courses')
					.send(course)
					.expect(200)
					.end(function(courseSaveErr, courseSaveRes) {
						// Handle Course save error
						if (courseSaveErr) done(courseSaveErr);

						// Get a list of Courses
						agent.get('/courses')
							.end(function(coursesGetErr, coursesGetRes) {
								// Handle Course save error
								if (coursesGetErr) done(coursesGetErr);

								// Get Courses list
								var courses = coursesGetRes.body;

								// Set assertions
								(courses[0].user._id).should.equal(userId);
								(courses[0].name).should.match('Course Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Course instance if not logged in', function(done) {
		agent.post('/courses')
			.send(course)
			.expect(401)
			.end(function(courseSaveErr, courseSaveRes) {
				// Call the assertion callback
				done(courseSaveErr);
			});
	});

	it('should not be able to save Course instance if no name is provided', function(done) {
		// Invalidate name field
		course.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Course
				agent.post('/courses')
					.send(course)
					.expect(400)
					.end(function(courseSaveErr, courseSaveRes) {
						// Set message assertion
						(courseSaveRes.body.message).should.match('Please fill Course name');
						
						// Handle Course save error
						done(courseSaveErr);
					});
			});
	});

	it('should be able to update Course instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Course
				agent.post('/courses')
					.send(course)
					.expect(200)
					.end(function(courseSaveErr, courseSaveRes) {
						// Handle Course save error
						if (courseSaveErr) done(courseSaveErr);

						// Update Course name
						course.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Course
						agent.put('/courses/' + courseSaveRes.body._id)
							.send(course)
							.expect(200)
							.end(function(courseUpdateErr, courseUpdateRes) {
								// Handle Course update error
								if (courseUpdateErr) done(courseUpdateErr);

								// Set assertions
								(courseUpdateRes.body._id).should.equal(courseSaveRes.body._id);
								(courseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Courses if not signed in', function(done) {
		// Create new Course model instance
		var courseObj = new Course(course);

		// Save the Course
		courseObj.save(function() {
			// Request Courses
			request(app).get('/courses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Course if not signed in', function(done) {
		// Create new Course model instance
		var courseObj = new Course(course);

		// Save the Course
		courseObj.save(function() {
			request(app).get('/courses/' + courseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', course.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Course instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Course
				agent.post('/courses')
					.send(course)
					.expect(200)
					.end(function(courseSaveErr, courseSaveRes) {
						// Handle Course save error
						if (courseSaveErr) done(courseSaveErr);

						// Delete existing Course
						agent.delete('/courses/' + courseSaveRes.body._id)
							.send(course)
							.expect(200)
							.end(function(courseDeleteErr, courseDeleteRes) {
								// Handle Course error error
								if (courseDeleteErr) done(courseDeleteErr);

								// Set assertions
								(courseDeleteRes.body._id).should.equal(courseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Course instance if not signed in', function(done) {
		// Set Course user 
		course.user = user;

		// Create new Course model instance
		var courseObj = new Course(course);

		// Save the Course
		courseObj.save(function() {
			// Try deleting Course
			request(app).delete('/courses/' + courseObj._id)
			.expect(401)
			.end(function(courseDeleteErr, courseDeleteRes) {
				// Set message assertion
				(courseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Course error error
				done(courseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Course.remove().exec();
		done();
	});
});