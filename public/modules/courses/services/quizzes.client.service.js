'use strict';

//Courses service used to communicate Courses REST endpoints
angular.module('courses').factory('Quiz', ['$resource',
	function($resource) {
		return $resource('/courses/quizzes',
		{
		  courseId: '@_id'
		},
		 {
			release: {
				method: 'POST'
			}
		});
	}
]);