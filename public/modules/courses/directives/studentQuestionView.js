/**
 * Created by Dylan on 3/31/2015.
 */

'use strict';

var app = angular.module('courses');
app.directive('studentQuestionView', function () {
    return {
        restrict: 'AE',
        //eff u and ur capital Q's dilly
        templateUrl: '/modules/courses/views/quiz/student-quiz-question.html'
    };
});
