/**
 * Created by Dylan on 4/4/2015.
 */
'use strict';

angular.module('courses').controller('QuizGraphCtrl', ['$scope', 'Socket',
    function ($scope, Socket) {
        var isLoaded = false;
        var userStore = [];
        var userExists, currentUser;
        Socket.on('send-question-to-all', function(question, index, courseId) {
            if ($scope.course._id === courseId && !isLoaded) {
                isLoaded = true;
                $scope.clear();
                $scope.formDataForQuestion(question);
            }
        });

        Socket.on('receive-student-answer', function(ansId, userId, courseId) {
            if (courseId === $scope.course._id) {

                userExists = false;
                var j;
                // Check for location of answer ID
                for (j = 0; j < $scope.currentQuestion.answers.length; ++j) {
                    var myAns = $scope.currentQuestion.answers[j];
                    if (myAns._id === ansId) {
                        break;
                    }
                }

                // Has user previously answered this question?
                for (var i = 0; i < userStore.length; ++i) {
                    var userEntity = userStore[i];
                    if (userEntity.userId === userId) {
                        userExists = true;
                        currentUser = userEntity;
                        break;
                    }
                }
                if (!userExists) {
                    userStore.push({
                        userId: userId,
                        ansIndex: j
                    });
                }

                // Adjust data distribution accordingly
                if (userExists) {
                    ($scope.data[0])[currentUser.ansIndex]--;
                    currentUser.ansIndex = j;
                }
                ($scope.data[0])[j]++;

            }
        });

        Socket.on('remove-question', function(question, courseId) {
            if ($scope.course._id === courseId) {
                $scope.clear();
                isLoaded = false;
            }
        });

        $scope.clear = function() {
            userStore = [];
            $scope.labels = [];
            $scope.series = [''];
            $scope.data = [[]];
        };

        $scope.formDataForQuestion = function(question) {
            // Form empty graph to start
            var i;
            var c = 65;
            for (i in question.answers) {
                $scope.labels.push(String.fromCharCode(c++));
            }
            for (i in question.answers) {
                $scope.data[0].push(0);
            }
        };
    }
]);
