/**
 * Created by Dylan on 3/31/2015.
 */

'use strict';

var app = angular.module('courses');
app.directive('studentQuestionView', function () {
    return {
        restrict: 'AE',
        templateUrl: '/modules/courses/views/Quiz/student-quiz-question.html'
    };
});
