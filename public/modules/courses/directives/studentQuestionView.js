/**
 * Created by Dylan on 3/31/2015.
 */

'use strict';

var app = angular.module('courses');
app.directive('studentQuestionView', function () {
    return {
        restrict: 'AE',
        templateUrl: '../../../../../student-quiz-question.html',
        link: function(scope,elem,attrs) {

        }
    };
});
