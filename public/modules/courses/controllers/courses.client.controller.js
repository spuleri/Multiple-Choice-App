'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', '$modal', '$log', 'Users', 'SubFinder', 'Socket', '$http',
	function($scope, $stateParams, $location, Authentication, Courses, $modal, $log, Users, SubFinder, Socket, $http) {
		$scope.authentication = Authentication;
        $scope.subFinder = SubFinder;

		//gets a user's joined and owned courses.    
        $scope.init = function() {
        	$http.get('/users/courses').
	        success(function(data, status) {
	          //setting userWithCourses = to the new user which has populated joined and owned Courses fields
	          $scope.userWithCourses = data;
	          console.log($scope.userWithCourses); 
	        }).
	        error(function(data, status) {
	          $scope.data = data || 'Request failed';
	          $scope.status = status;
	          console.log($scope.data + ': '+ $scope.status);
	      });
	    };
	
		
		$scope.open = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/courses/views/create-course.client.view.html',
				controller: function ($scope, $modalInstance){

					$scope.ok = function () {
						//can only close if the form is valid!
						//eg if the "required" field is filled

						//if (createCustomerForm.$valid){
						    $modalInstance.close();
						//}
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.openJoinCourse = function (size) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/courses/views/join-course.client.view.html',
				controller: function ($scope, $modalInstance){

					$scope.ok = function () {
						//can only close if the form is valid!
						//eg if the "required" field is filled

						//if (createCustomerForm.$valid){
							//$modalInstance.close($scope.insertedCCode);
							setTimeout(function(){
							    $modalInstance.close();
							},1300);
						//}
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	

		// Create new Course
		$scope.create = function() {
			// Create new Course object
			if ($scope.authentication.user.roles[0] === 'admin'){

				var course = new Courses ({
					name: this.name,
					courseCode: this.courseCode,
					owner: $scope.authentication.user._id,
					roster: this.roster,
                    questions: []
				});

					// Redirect after save
					course.$save(function(response) {
						$location.path('courses/' + response._id);



						$scope.user = Authentication.user;
						$scope.user.ownedCourses.push(response._id);
						$scope.success = $scope.error = null;
						var user = new Users($scope.user);
						user.$update(function(response) {
							$scope.success = true;
							Authentication.user = response;
						}, function(response) {
							$scope.error = response.data.message;
						});				



						// Clear form fields
						$scope.name = '';
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			};


	// Remove existing Course
		$scope.remove = function(course) {
			if ($scope.authentication.user.roles[0] === 'admin'){
				if ( course ) { 
					course.$remove();

					for (var i in $scope.courses) {
						if ($scope.courses [i] === course) {
							$scope.courses.splice(i, 1);
						}
					}
				} else {
					$scope.course.$remove(function() {
						$location.path('courses');
					});
				}
			}
		};

	    // Remove existing quiz
		$scope.removeQuiz = function() {
			//just sets deleteMe to true and calls update()
			$scope.deleteMe = true;
			$scope.update();
		};
		$scope.editQuiz = function(){
			$scope.editMe = true;
			$scope.update();
		};

		// Update existing Course
		$scope.update = function() {
			if ($scope.authentication.user.roles[0] === 'admin') {
				var course = $scope.course;

				//for adding a quiz to the course
	            var quiz = $scope.quiz;
	            if (!$scope.editMe && !$scope.deleteMe && quiz && quiz.name !== '') {
	                course.quizzes.push(quiz);
	            }
	            //for deleting a quiz from a course
	            if($scope.deleteMe){
	        		for (var i in course.quizzes) {
						if (course.quizzes[i] === quiz) {
							course.quizzes.splice(i, 1);
						}
					}
					$scope.deleteMe = undefined;
	            }

	            //actually updating the course
				course.$update(function () {
					$location.path('courses/' + course._id);
				}, function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};
		// Find a list of Courses
		$scope.find = function() {
			$scope.courses = Courses.query();
		};

		// Find existing Course
		$scope.findOne = function() {
			$scope.course = Courses.get({
				courseId: $stateParams.courseId
			});
            $scope.quiz = {
                name: '',
                questions: []
            };
		};

          $scope.alerts = [];

		  $scope.closeAlert = function(index) {
		    $scope.alerts.splice(index, 1);
		  };

		// Join a Course
		$scope.joinCourse = function() {

			$scope.course = $scope.selectedCourse;
			var course = $scope.course;
			$scope.user = Authentication.user;			
			var flag = false;
			if ($scope.insertedCCode === course.courseCode) {
				for (var i in $scope.user.joinedCourses) {
					if ($scope.user.joinedCourses[i] === course._id) {
						flag = true;  // Already joined the course
					}
				}
				if (!flag) {
					$scope.user.joinedCourses.push(course._id);
					$scope.course.roster.push($scope.user._id);
					$scope.alerts.push({type: 'success', msg: 'You are now enrolled in the course.'});

					$scope.success = $scope.error = null;
					var user = new Users($scope.user);
					user.$update(function(response) {
						$scope.success = true;
						Authentication.user = response;
					}, function(response) {
						$scope.error = response.data.message;
					});

					course.$update(function () {
						$location.path('courses/' + course._id);
					}, function (errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
				else {
					$scope.alerts.push({type: 'warning', msg: 'You are already in this course!'});
				}


			}
			else {
				$scope.alerts.push({type: 'danger', msg: 'Wrong course code, try again.'});
			}
		};


        $scope.findOneQuiz = function() {
            var desired = $stateParams.quizId;
            $scope.course = Courses.get({
                courseId: $stateParams.courseId
            }, function() {
                $scope.quiz = $scope.subFinder.search(desired, $scope.course.quizzes);
            });
        };

        //Function to dynamically set class=active to navbar
        $scope.isActive = function (viewLocation) { 
			//returns an array of each part of the location 
			//delimeted by the slash
			//e.g. for "courses/54f/quizzes"
			//will return ["course", "54f", "quizzes"]
			//I want the last part of the url, so i am popping the array
			var path = $location.path().split('/');
			var result =  path.pop() ;
        	return viewLocation === result;
    	};

    	
        $scope.addQuestion = function(num) {
        	if (num <= 20 && $scope.quiz.questions.length <= 200) {
		    	for (var i = 0; i < num; ++i) {
		          $scope.quiz.questions.push({
		              title:'',
		              description: '',
		              answers: []              
		          });

		      	}
		      }
        };

        $scope.insertQuestion = function(quest) {
        	if ($scope.quiz.questions.length <= 200) {
	        	var index = $scope.quiz.questions.indexOf(quest);
		          $scope.quiz.questions.splice(index + 1, 0, {
		              title:'',
		              description: '',
		              answers: []              
		          });
	      	}	      			     
        };

        $scope.removeQuestion = function(quest) {
        	if ($scope.quiz.questions.length > 1) {
	        	var index = $scope.quiz.questions.indexOf(quest);
		        $scope.quiz.questions.splice(index, 1);
	      	}	
	      			     
        };

        $scope.addAnswer = function(quest, num) {
        	if (num <= 20 && quest.answers.length <= 50) {
	        	for (var i = 0; i < num; ++i) {
		            quest.answers.push({
		                name: '',
		                valid: false
		            });
	        	}
	        }
        };

        $scope.insertAnswer = function(quest, ans) {
        	if (quest.answers.length <= 50) {
	        	var index = quest.answers.indexOf(ans);
		          quest.answers.splice(index + 1, 0, {
		                name: '',
		                valid: false            
		          });
	      	}
	      			     
        };

        $scope.removeAnswer = function(quest, ans) {
        	if (quest.answers.length > 1) {
	        	var index = quest.answers.indexOf(ans);
		        quest.answers.splice(index, 1);
	      	}
	      			     
        };

        $scope.quickMake = function(numQ, numA) {
        	if (numQ <= 20 && numA <= 20) {
		    	for (var i = 0; i < numQ; ++i) {
		          $scope.quiz.questions.push({
		              title:'',
		              description: '',
		              answers: [{
		                name: '',
		                valid: false
		              }]              
		          });
		          /*
  	        		for (var j = 0; j < numA; ++j) {
		            $scope.quiz.questions.answers.push({
		                name: '',
		                valid: false
		            });
	        	}
*/

		      	}
		      }
        };

/*
        // DEBUG CODE~!@#
        $scope.removeUserCourses = function() {
        	$scope.user = Authentication.user;
        	$scope.user.joinedCourses = [];

			$scope.success = $scope.error = null;
			var user = new Users($scope.user);
			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
			}, function(response) {
				$scope.error = response.data.message;
			});
        };
*/


	}
]);
