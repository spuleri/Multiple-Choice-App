'use strict';

angular.module('courses').config(['$stateProvider',
    function($stateProvider) {
        // Courses state routing
        $stateProvider.
        state('listCourses', {
            url: '/courses',
            templateUrl: 'modules/courses/views/list-courses.client.view.html'
        }).
        state('createCourse', {
            url: '/courses/create',
            templateUrl: 'modules/courses/views/create-course.client.view.html',
            data: {
                needAdmin: true
            }
        }).
        state('viewCourse', {
            url: '/courses/:courseId',
            templateUrl: 'modules/courses/views/view-course.client.view.html'
        }).
        state('editQuiz', {
            url: '/courses/:courseId/:quizId/edit',
            templateUrl: 'modules/courses/views/quiz/edit-quiz-in-course.client.view.html'
		}).
        state('editCourse', {
            url: '/courses/:courseId/edit',
            templateUrl: 'modules/courses/views/edit-course.client.view.html',
            data: {
                needAdmin: true
            }
        }).
        state('viewQuiz', {
            url: '/courses/:courseId/:quizId',
            templateUrl: 'modules/courses/views/quiz/view-quiz-in-course.client.view.html'
        });

    }
]);


angular.module('courses').run(['$rootScope', '$state', 'Authentication', function($rootScope, $state, Authentication) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {

	    var authentication = Authentication;

	    if (toState.data && toState.data.needAdmin && authentication.user.roles[0] !== 'admin') {
	    	event.preventDefault();
	    }

	});
}]);



