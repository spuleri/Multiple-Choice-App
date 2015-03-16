'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', '$modal', '$log', 'Users', 'SubFinder',
	function($scope, $stateParams, $location, Authentication, Courses, $modal, $log, Users, SubFinder) {
		$scope.authentication = Authentication;
        $scope.subFinder = SubFinder;

		// Blocking non admins from creating/editing/deleting courses..
		
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

		// Update existing Course
		$scope.update = function() {
			if ($scope.authentication.user.roles[0] === 'admin') {
				var course = $scope.course;

            var quiz = $scope.quiz;
            if (quiz && quiz.name !== '') {
                course.quizzes.push(quiz);
            }
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
			$scope.user = Authentication.user;			
			$scope.enrolledCourses = [];
			/*
			 courses does not return your actual data immediately.
			 It returns something will hold your data when the ajax returns.
			 On that (the $promise), you can register an additional callback
			 to log your data.
			 */

			$scope.courses.$promise.then(function(data) {
       			console.log(data);
       			for (var i in data){
       				//finding courses the user is enrolled in
					for(var j in $scope.user.joinedCourses) {
						if(data[i]._id === $scope.user.joinedCourses[j]){
							$scope.enrolledCourses.push($scope.courses[i]);
						}
					}
					//finding courses that the user owns
					for(var x in $scope.user.ownedCourses){
						if(data[i]._id === $scope.user.ownedCourses[x]){
							$scope.enrolledCourses.push($scope.courses[i]);
						}
					}
				}
				console.log($scope.enrolledCourses);
   			});



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
                console.log($scope.quiz.questions);
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

        $scope.addQuestion = function() {
          $scope.quiz.questions.push({
              title:'',
              description: '',
              answers: []
          });
        };

        $scope.addAnswer = function(quest) {
            quest.answers.push({
                name: '',
                valid: false
            });
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
