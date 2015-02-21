'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', '$modal', '$log', 'Users',
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
							$modalInstance.close($scope.insertedCCode);
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
					owner: $scope.authentication.user._id
				});

					// Redirect after save
					course.$save(function(response) {
						$location.path('courses/' + response._id);
						// $scope.user = Authentication.user;
						// $scope.user.ownedCourses.push(response._id);
						// $scope.success = $scope.error = null;
						// var user = new Users($scope.user);
						// user.$update(function(response) {
						// 	$scope.success = true;
						// 	Authentication.user = response;
						// }, function(response) {
						// 	$scope.error = response.data.message;
						// });				

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
            if (quiz.name !== '') {
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
		};

		// Find existing Course
		$scope.findOne = function() {
			$scope.course = Courses.get({
				courseId: $stateParams.courseId
			}, function () {
                console.log($scope.course);
            });
            $scope.quiz = {
                name: ''
            };
		};

		// Join a Course
		$scope.joinCourse = function() {

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
				}

				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});


			}

		};

        $scope.findOneQuiz = function() {
            $scope.course = Courses.get({
                courseId: $stateParams.courseId
            }, function() {
                $scope.quiz = $scope.subFinder.search($stateParams.quizId, $scope.course.quizzes);
            });
        };
	}
]);
