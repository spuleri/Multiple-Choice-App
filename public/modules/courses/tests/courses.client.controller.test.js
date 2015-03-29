'use strict';

(function() {
	// Courses Controller Spec
	describe('Courses Controller Tests', function() {
		// Initialize global variables
		var CoursesController,
		QuizController,
		scope,
		quizScope,
		$httpBackend,
		$stateParams,
		$location,
		$interval,
		socketMock,
        subFinder;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$interval_, $injector, $templateCache, SubFinder) {
			//need to cache both pages for tests to work
            $templateCache.put('modules/core/views/home.client.view.html', '.<template-goes-here />');
            $templateCache.put('modules/courses/views/view-course.client.view.html', '.<template-goes-here />');
			$templateCache.put('modules/courses/views/course-partials/partial-course-home.html', '.<template-goes-here />');

			// Set a new global scope
			scope = $rootScope.$new();
			quizScope = $rootScope.$new();
            subFinder = $injector.get('SubFinder');
            socketMock = new sockMock($rootScope);

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			//$interval = _$interval_;

			// Initialize the Courses controller.
			CoursesController = $controller('CoursesController', {
				$scope: scope,
                SubFinder: subFinder
			});

			//Initialze the Quiz controller
			QuizController = $controller('QuizController', {
				$scope: quizScope,
				Socket: socketMock
			});

		}));

		it('$scope.find() should create an array with at least one Course object fetched from XHR', inject(function(Courses) {
			// Create sample Course using the Courses service
			var sampleCourse = new Courses({
				name: 'New Course'
			});

			// Create a sample Courses array that includes the new Course
			var sampleCourses = [sampleCourse];
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['admin'],
	            ownedCourses: [],
	            joinedCourses: ['1defa34562bb25342e7dad56a3','1defa34562bb25342e7da456a1']
	        };
			// Set GET response
			$httpBackend.expectGET('courses').respond(sampleCourses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.courses).toEqualData(sampleCourses);
		}));

		it('$scope.findOne() should create an array with one Course object fetched from XHR using a courseId URL parameter', inject(function(Courses) {
			// Define a sample Course object
			var sampleCourse = new Courses({
				name: 'New Course'
			});

			// Set the URL parameter
			$stateParams.courseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/courses\/([0-9a-fA-F]{24})$/).respond(sampleCourse);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.course).toEqualData(sampleCourse);
		}));

		it('should expose the authentication service', function() {
			scope.authentication.user = 'Foo';
			scope.authentication.user.firstName = 'bar';
			scope.authentication.user.roles = 'admin';
			expect(scope.authentication).toBeTruthy();
		});


		it('$scope.create() with valid form data and an Admin role should send a POST request with the form input values and then locate to new object URL', inject(function(Courses) {
			// Create a sample Course object
			var sampleCoursePostData = new Courses({
				name: 'New Course',
				questions: []
			});

			// Create a sample Course response
			var sampleCourseResponse = new Courses({
				_id: '525cf20451979dea2c000001',
				name: 'New Course'
			});

			// Fixture mock form input values
			scope.name = 'New Course';
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['admin'],
	            ownedCourses: []
	        };

			// Set POST response
			$httpBackend.expectPOST('courses', sampleCoursePostData).respond(sampleCourseResponse);

			// Set PUT response
			$httpBackend.expectPUT('users', scope.authentication.user).respond();

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Course was created
			expect($location.path()).toBe('/courses/' + sampleCourseResponse._id);
		}));

		it('$scope.create() with valid form data and a User role should NOT send a POST request with the form input values and then NOT locate to new object URL', inject(function(Courses) {
			// Create a sample Course object
			var sampleCoursePostData = new Courses({
				name: 'New Course'
			});

			// Create a sample Course response
			var sampleCourseResponse = new Courses({
				_id: '525cf20451979dea2c000001',
				name: 'New Course'
			});

			// Fixture mock form input values
			scope.name = 'New Course';
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['student']
	        };

			// Set not ? POST response
			//$httpBackend.expectPOST('courses', sampleCoursePostData).respond(sampleCourseResponse);

			// Run controller functionality
			scope.create();
			//$httpBackend.flush();

			// Test form inputs are not reset
			expect(scope.name).toEqual('New Course');

			// Test URL redirection after the Course wasnt created
			expect($location.path()).toBe('');
		}));

		it('$scope.update() should update a valid Course with an Admin role', inject(function(Courses) {
			// Define a sample Course put data
			var sampleCoursePutData = new Courses({
				_id: '525cf20451979dea2c000001',
				name: 'New Course'
			});

			// Mock Course in scope
			scope.course = sampleCoursePutData;
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['admin']
	        };


			// Set PUT response
			$httpBackend.expectPUT(/courses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/courses/' + sampleCoursePutData._id);
		}));

		it('$scope.update() should not update a valid Course with a User role', inject(function(Courses) {
			// Define a sample Course put data
			var sampleCoursePutData = new Courses({
				_id: '525cf20451979dea2c000001',
				name: 'New Course'
			});

			// Mock Course in scope
			scope.course = sampleCoursePutData;
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['user']
	        };


			// Set PUT response
			// $httpBackend.expectPUT(/courses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			// $httpBackend.flush();

			// Test URL location to not be a new object
			expect($location.path()).toBe('');
		}));

		it('$scope.remove() should send a DELETE request with a valid courseId with a User role as admin and remove the Course from the scope', inject(function(Courses) {
			// Create new Course object
			var sampleCourse = new Courses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Courses array and include the Course
			scope.courses = [sampleCourse];
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['admin']
	        };


			// Set expected DELETE response
			$httpBackend.expectDELETE(/courses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCourse);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.courses.length).toBe(0);
		}));

		it('$scope.remove() should send a not send DELETE request with a valid courseId with a User role and NOT remove the Course from the scope', inject(function(Courses) {
			// Create new Course object
			var sampleCourse = new Courses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Courses array and include the Course
			scope.courses = [sampleCourse];
			scope.authentication.user = {
	            firstName: 'Full',
	            lastName: 'Name',
	            displayName: 'Im an admin',
	            email: 'test@test.com',
	            ufid: '8888-8888',
	            gatorlink: 'crazyman',
	            roles: ['user']
	        };


			// Set expected DELETE response
			$httpBackend.expectDELETE(/courses\/([0-9a-fA-F]{24})$/).respond(403);

			// Run controller functionality
			scope.remove(sampleCourse);
			// $httpBackend.flush();

			// Test array after unsuccessful delete
			expect(scope.courses.length).toBe(1);
		}));


		describe('Course Joining', function() {	

			it('joinCourse() user should be able to join a course', inject(function(Courses) {
				scope.authentication.user = {
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};



				var sampleCoursePutData = new Courses({
					_id: '490it9804j5g98j340erofkj34590',
					name: 'Gotham', 
					courseCode: 'lul',
					owner: 'f892j34958fg982901jasdl3',
					roster: []
				});

				scope.selectedCourse = sampleCoursePutData;

				scope.insertedCCode = 'lul';

				scope.joinCourse();
				expect(scope.authentication.user.joinedCourses[0]).toEqual('490it9804j5g98j340erofkj34590');
			}));

			it('should not be able to join course without correct course code', inject(function(Courses) {
				scope.authentication.user = {
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
				
				var sampleCoursePutData = new Courses({
					_id: '490it9804j5g98j340erofkj34590',
					name: 'Gotham', 
					courseCode: 'lul',
					owner: 'f892j34958fg982901jasdl3',
					roster: []
				});

				scope.selectedCourse = sampleCoursePutData;
				scope.insertedCCode = 'idk';
				scope.joinCourse();


				expect(scope.authentication.user.joinedCourses[0]).toBe(undefined);
			}));

			it('user cannont join the course if already enrolled', inject(function(Courses) {
				scope.authentication.user = {
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
				
				var sampleCoursePutData = new Courses({
					_id: '490it9804j5g98j340erofkj34590',
					name: 'Gotham', 
					courseCode: 'lul',
					owner: 'f892j34958fg982901jasdl3',
					roster: []
				});

				scope.selectedCourse = sampleCoursePutData;
				scope.insertedCCode = 'lul';
								
				scope.joinCourse();
				expect(scope.authentication.user.joinedCourses[0]).toEqual('490it9804j5g98j340erofkj34590');
				scope.joinCourse();
				expect(scope.authentication.user.joinedCourses[1]).toEqual(undefined);
			}));

			it('course roster updates when user enrolls', inject(function(Courses) {
				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
				
				var sampleCoursePutData = new Courses({
					_id: '490it9804j5g98j340erofkj34590',
					name: 'Gotham', 
					courseCode: 'lul',
					owner: 'f892j34958fg982901jasdl3',
					roster: []
				});

				scope.selectedCourse = sampleCoursePutData;
				scope.insertedCCode = 'lul';
				scope.joinCourse();
				expect(scope.course.roster[0]).toEqual('oijg093094j0f9j0030fkw');
			}));

/*			
			it('professor(creator) cannot join his own course', inject(function(Courses) {

			}));
*/
		});
		describe('Quiz tests', function() {

	        it ('$scope.findOneQuiz() should be able to find a quiz by ID from any list of quizzes', inject(function(Courses) {

	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3'},
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1'},
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

	            // Set the URL parameter
	            $stateParams.courseId = '525a8422f6d0f87f0e407a33';
	            $stateParams.quizId = sampleCourse.quizzes[1]._id;

	            scope.subFinder = subFinder;

	            // Set GET response
	            $httpBackend.expectGET(/courses\/([0-9a-fA-F]{24})$/).respond(sampleCourse);
	            scope.findOneQuiz();
	            $httpBackend.flush();
	            expect(scope.quiz).toEqual(sampleCourse.quizzes[1]);
	        }));

	        it ('$scope.addQuestion should be able to add questions to a courses specific Quiz and save it. (e.g create a quiz)', inject(function(Courses) {

				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3'},
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1',
	                       questions: []
	                   },
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

				//set scopes
				scope.quiz = sampleCourse.quizzes[2];
				scope.course = sampleCourse;

				// Set PUT response
				$httpBackend.expectPUT('courses', scope.course).respond();

				// Run controller functionality
				//add 4 questions to the current scope.quiz which is the 3rd quiz in the course
				scope.addQuestion(4);
				//run scope.update() which updates the scope.course (with the 4 empty questions!)
				scope.update();
				$httpBackend.flush();
				// Test questions array after sucessful addition of questions
				expect(sampleCourse.quizzes[2].questions.length).toBe(4);	           
	        }));

	        it ('$scope.removeQuiz should be able to delete a quiz from the quizzes page if an Admin', inject(function(Courses) {

				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3'},
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1'},
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

				//set scopes
				scope.quiz = sampleCourse.quizzes[2];
				scope.course = sampleCourse;

				// Set PUT response
				$httpBackend.expectPUT('courses', scope.course).respond();

				// Run controller functionality
				scope.removeQuiz();
				 $httpBackend.flush();
				// Test array after successful delete
				expect(sampleCourse.quizzes.length).toBe(3);	           
	        }));

	        it ('$scope.removeQuiz should NOT be able to delete a quiz from the quizzes page if a Student', inject(function(Courses) {
				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['user'],
					joinedCourses: []

				};
	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3'},
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1'},
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

				//set scopes
				scope.quiz = sampleCourse.quizzes[2];
				scope.course = sampleCourse;

				// Set PUT response
				$httpBackend.expectPUT('courses', scope.course).respond();

				// Run controller functionality
				scope.removeQuiz();
				// Test array after unsuccessful delete
				expect(sampleCourse.quizzes.length).toBe(4);	           
	        }));

	        it ('$scope.editQuiz should be able to edit a quizzes everything from the quizzes page if a Admin', inject(function(Courses) {
				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['admin'],
					joinedCourses: []

				};
	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3',
	                       questions: [
	                       		{
	                       			description: 'What is 3 + 3',
	                       			answers: [
	                       				{
	                       					name: '2',
	                       					valid: false
	                       				},
	 	                  				{
	                       					name: '6',
	                       					valid: true

	                       				},
	                       				{
	                       					name: '2',
	                       					valid: true
	                       				}
	                       			]
	                       		}
	                    	]
	                    },
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1'},
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

				//set scopes
				scope.quiz = sampleCourse.quizzes[0];
				scope.course = sampleCourse;
				scope.quiz.questions[0].description = 'This quiz has been edited';
				scope.quiz.questions[0].answers[1].valid = false;
				// Set PUT response
				$httpBackend.expectPUT('courses', scope.course).respond();

				// Run controller functionality
				scope.editQuiz();
				$httpBackend.flush();
				// Test array after succsesful edit
				expect(sampleCourse.quizzes[0].questions[0].description).toBe('This quiz has been edited');
				expect(sampleCourse.quizzes[0].questions[0].answers[1].valid).toBe(false);	 	           
	        }));

	        it ('$scope.editQuiz should NOT allow students to edit quizzes', inject(function(Courses) {
				scope.authentication.user = {
					_id: 'oijg093094j0f9j0030fkw',
					firstName: 'Bruce',
					lastName: 'Wayne',
					displayName: 'Bruce Wayne',
					email: 'bman@gg.com',
					username: 'bwayne',
					password: 'uio987p4',
					ufid: '1337-1337',
					gatorlink: 'imbatman',
					roles: ['user'],
					joinedCourses: []

				};
	            var sampleCourse = new Courses({
	                name: 'My Course',
	                quizzes: [
	                    { name: 'Quiz 1',
	                       _id: '1defa34562bb25342e7dad56a3',
	                       questions: [
	                       		{
	                       			description: 'What is 3 + 3',
	                       			answers: [
	                       				{
	                       					name: '2',
	                       					valid: false
	                       				},
	 	                  				{
	                       					name: '6',
	                       					valid: true

	                       				},
	                       				{
	                       					name: '2',
	                       					valid: true
	                       				}
	                       			]
	                       		}
	                    	]
	                    },
	                    { name: 'Quiz 2',
	                       _id: '1defa34562bb25342e7d2456a3'},
	                    { name: 'Quiz 3',
	                       _id: '1defa34562bb25342e7da456a1'},
	                    { name: 'Quiz 4',
	                       _id: '1defa34562bb25342e7daf56a3'}
	                ]
	            });

				//set scopes
				scope.quiz = sampleCourse.quizzes[0];
				scope.course = sampleCourse;
				scope.quiz.questions[0].description = 'This quiz has been edited';
				scope.quiz.questions[0].answers[1].valid = false;
				// Set PUT response
				$httpBackend.expectPUT('courses', scope.course).respond();

				// Run controller functionality
				scope.editQuiz();
				// Test array after unsuccsesful edit
				expect(sampleCourse.quizzes[0].questions[0].description).toBe('This quiz has been edited');
				expect(sampleCourse.quizzes[0].questions[0].answers[1].valid).toBe(false);	 	           
	        }));

			describe('Socket tests', function() {

		        it ('QuizController should be able to START a question and start the timer', inject(function(Courses) {

					quizScope.authentication.user = {
						_id: 'oijg093094j0f9j0030fkw',
						firstName: 'Bruce',
						lastName: 'Wayne',
						displayName: 'Bruce Wayne',
						email: 'bman@gg.com',
						username: 'bwayne',
						password: 'uio987p4',
						ufid: '1337-1337',
						gatorlink: 'imbatman',
						roles: ['user'],
						joinedCourses: []
					};
		            var sampleCourse = new Courses({
		                name: 'My Course',
		                quizzes: [
		                    { name: 'Quiz 1',
		                       _id: '1defa34562bb25342e7dad56a3',
		                       questions: [
		                       		{
		                       			description: 'What is 3 + 3',
		                       			time: 20,
		                       			answers: [
		                       				{
		                       					name: '2',
		                       					valid: false
		                       				},
		 	                  				{
		                       					name: '6',
		                       					valid: true

		                       				},
		                       				{
		                       					name: '2',
		                       					valid: true
		                       				}
		                       			]
		                       		}
		                    	]
		                    },
		                    { name: 'Quiz 2',
		                       _id: '1defa34562bb25342e7d2456a3'},
		                    { name: 'Quiz 3',
		                       _id: '1defa34562bb25342e7da456a1'},
		                    { name: 'Quiz 4',
		                       _id: '1defa34562bb25342e7daf56a3'}
		                ]
		            });

					//set scopes
					quizScope.quiz = sampleCourse.quizzes[0];
					quizScope.course = sampleCourse;

					//run controller functionality
					quizScope.sendQuestion(quizScope.quiz.questions[0]);
					//checking that conroller emitted correct question!
					expect(socketMock.emits['start-question'][0][0]).toBe(quizScope.quiz.questions[0]);

		        }));

		        it ('QuizController should be able to RECIEVE a question and set currentQuestion to the question recieve', inject(function(Courses) {
					quizScope.authentication.user = {
						_id: 'oijg093094j0f9j0030fkw',
						firstName: 'Bruce',
						lastName: 'Wayne',
						displayName: 'Bruce Wayne',
						email: 'bman@gg.com',
						username: 'bwayne',
						password: 'uio987p4',
						ufid: '1337-1337',
						gatorlink: 'imbatman',
						roles: ['user'],
						joinedCourses: []
					};
		            var sampleCourse = new Courses({
		                name: 'My Course',
		                quizzes: [
		                    { name: 'Quiz 1',
		                       _id: '1defa34562bb25342e7dad56a3',
		                       questions: [
		                       		{
		                       			description: 'What is 3 + 3',
		                       			time: 20,
		                       			answers: [
		                       				{
		                       					name: '2',
		                       					valid: false
		                       				},
		 	                  				{
		                       					name: '6',
		                       					valid: true

		                       				},
		                       				{
		                       					name: '2',
		                       					valid: true
		                       				}
		                       			]
		                       		}
		                    	]
		                    },
		                    { name: 'Quiz 2',
		                       _id: '1defa34562bb25342e7d2456a3'},
		                    { name: 'Quiz 3',
		                       _id: '1defa34562bb25342e7da456a1'},
		                    { name: 'Quiz 4',
		                       _id: '1defa34562bb25342e7daf56a3'}
		                ]
		            });

					//set scopes
					quizScope.quiz = sampleCourse.quizzes[0];
					quizScope.course = sampleCourse;

					// Set mock socket recieving emit from server 
					socketMock.receive('send-question-to-all', quizScope.course.quizzes[0].questions[0]);

					// Run controller functionality

					// test currentQuestion to be equal to the one that was sent by the server and the the max time is the original question time
					expect(quizScope.currentQuestion).toBe(quizScope.course.quizzes[0].questions[0]); 	        
					expect(quizScope.currentQuestion.maxTime).toBe(20); 

		        }));

		        it ('QuizController should be able to recieve a current questions current time from the backend socket and set currentQuestion.time to it', inject(function(Courses) {
					quizScope.authentication.user = {
						_id: 'oijg093094j0f9j0030fkw',
						firstName: 'Bruce',
						lastName: 'Wayne',
						displayName: 'Bruce Wayne',
						email: 'bman@gg.com',
						username: 'bwayne',
						password: 'uio987p4',
						ufid: '1337-1337',
						gatorlink: 'imbatman',
						roles: ['user'],
						joinedCourses: []
					};
		            var sampleCourse = new Courses({
		                name: 'My Course',
		                quizzes: [
		                    { name: 'Quiz 1',
		                       _id: '1defa34562bb25342e7dad56a3',
		                       questions: [
		                       		{
		                       			description: 'What is 3 + 3',
		                       			time: 20,
		                       			answers: [
		                       				{
		                       					name: '2',
		                       					valid: false
		                       				},
		 	                  				{
		                       					name: '6',
		                       					valid: true

		                       				},
		                       				{
		                       					name: '2',
		                       					valid: true
		                       				}
		                       			]
		                       		}
		                    	]
		                    },
		                    { name: 'Quiz 2',
		                       _id: '1defa34562bb25342e7d2456a3'},
		                    { name: 'Quiz 3',
		                       _id: '1defa34562bb25342e7da456a1'},
		                    { name: 'Quiz 4',
		                       _id: '1defa34562bb25342e7daf56a3'}
		                ]
		            });

					//set scopes
					quizScope.quiz = sampleCourse.quizzes[0];
					quizScope.course = sampleCourse;

					// Set mock socket recieving emit from server 
					socketMock.receive('send-question-to-all', quizScope.course.quizzes[0].questions[0]);
					// test currentQuestion to be equal to the one that was sent by the server and the the max time is the original question time
					expect(quizScope.currentQuestion).toBe(quizScope.course.quizzes[0].questions[0]); 
					expect(quizScope.currentQuestion.maxTime).toBe(20); 


					//set time to 10 seconds to indicate 10 seconds has passed
					quizScope.course.quizzes[0].questions[0].time = 10;
					//mock recieving a time from server
					socketMock.receive('current-time-from-server', quizScope.course.quizzes[0].questions[0].time);
					//Verify currentQuestions time is 10s;
					expect(quizScope.currentQuestion.time).toBe(10); 

	           
		        }));

		        it ('QuizController should be able to END a question and set currentQuestion to undefined when timer has experied', inject(function(Courses) {
					quizScope.authentication.user = {
						_id: 'oijg093094j0f9j0030fkw',
						firstName: 'Bruce',
						lastName: 'Wayne',
						displayName: 'Bruce Wayne',
						email: 'bman@gg.com',
						username: 'bwayne',
						password: 'uio987p4',
						ufid: '1337-1337',
						gatorlink: 'imbatman',
						roles: ['user'],
						joinedCourses: []
					};
		            var sampleCourse = new Courses({
		                name: 'My Course',
		                quizzes: [
		                    { name: 'Quiz 1',
		                       _id: '1defa34562bb25342e7dad56a3',
		                       questions: [
		                       		{
		                       			description: 'What is 3 + 3',
		                       			time: 20,
		                       			answers: [
		                       				{
		                       					name: '2',
		                       					valid: false
		                       				},
		 	                  				{
		                       					name: '6',
		                       					valid: true

		                       				},
		                       				{
		                       					name: '2',
		                       					valid: true
		                       				}
		                       			]
		                       		}
		                    	]
		                    },
		                    { name: 'Quiz 2',
		                       _id: '1defa34562bb25342e7d2456a3'},
		                    { name: 'Quiz 3',
		                       _id: '1defa34562bb25342e7da456a1'},
		                    { name: 'Quiz 4',
		                       _id: '1defa34562bb25342e7daf56a3'}
		                ]
		            });

					//set scopes
					quizScope.quiz = sampleCourse.quizzes[0];
					quizScope.course = sampleCourse;

					// Set mock socket recieving emit from server 
					socketMock.receive('send-question-to-all', quizScope.course.quizzes[0].questions[0]);
					// test currentQuestion to be equal to the one that was sent by the server and the the max time is the original question time
					expect(quizScope.currentQuestion).toBe(quizScope.course.quizzes[0].questions[0]); 
					expect(quizScope.currentQuestion.maxTime).toBe(20); 



					//mock recieving end question from server
					socketMock.receive('remove-question', quizScope.course.quizzes[0].questions[0]);
					//Verify currentQuestions time is undefined now that question is over
					expect(quizScope.currentQuestion).toBe(undefined); 
		        }));

			});

		});	


	});
	/*
	Simple mock for socket.io
	see: https://github.com/btford/angular-socket-io-seed/issues/4
	thanks to https://github.com/southdesign for the idea
	*/
	var sockMock = function($rootScope){
	  this.events = {};
	  this.emits = {};

	  // intercept 'on' calls and capture the callbacks
	  this.on = function(eventName, callback){
	    if(!this.events[eventName]) this.events[eventName] = [];
	    this.events[eventName].push(callback);
	  };

	  // intercept 'emit' calls from the client and record them to assert against in the test
	  this.emit = function(eventName){
	    var args = Array.prototype.slice.call(arguments, 1);

	    if(!this.emits[eventName])
	      this.emits[eventName] = [];
	    this.emits[eventName].push(args);
	  };

	  //simulate an inbound message to the socket from the server (only called from the test)
	  this.receive = function(eventName){
	    var args = Array.prototype.slice.call(arguments, 1);

	    if(this.events[eventName]){
	      angular.forEach(this.events[eventName], function(callback){
	        $rootScope.$apply(function() {
	          callback.apply(this, args);
	        });
	      });
	    };
	  };
	};

}());
