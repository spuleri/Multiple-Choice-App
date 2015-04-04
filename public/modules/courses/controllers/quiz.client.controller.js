'use strict';

// Quizzes controller
angular.module('courses').controller('QuizController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', '$modal', '$log', 'Users', 'SubFinder', 'Socket', '$interval',
	function($scope, $stateParams, $location, Authentication, Courses, $modal, $log, Users, SubFinder, Socket, $interval) {
		$scope.authentication = Authentication;
        $scope.subFinder = SubFinder;
        $scope.user = Authentication.user;
        var quizInArray, quizIndex, questIndex;
        const start = 'start-question';

		//Button to broadcast question to students.
		$scope.sendQuestion = function(question, questInd){
			if (question.time > 0 && !($scope.currentQuestion)) {

                $scope.questIndex = questInd;
				// tell server to start question
				Socket.emit(start, question, questInd);
				
				var timer = $interval(function(){
					//emits question every second, just in case student leaves page,
					//or is not on page when prof starts it
					Socket.emit(start, question, questInd);
					question.time--;
					//every interval emit the current time so students can see time left
					Socket.emit('current-time', question.time);
					if(question.time <= 0){
						//tell server to end question
						Socket.emit('end-question', question);
						$scope.stop();				
					}				
					//console.log(question.time);
				}, 1000);
				//will execute function, every second until time is 0.

				// stops the interval
				$scope.stop = function() {
				  $interval.cancel(timer);
				};
			}
		};
		
		Socket.on('send test back', function(data){
			console.log('i got it from the server');			
			$scope.testySocket = data;
		});
		
		$scope.addTime = function(question){
			question.time = question.time + 15;
		};
		$scope.subtractTime = function(question){
			if (question.time >= 15) {
				question.time = question.time - 15;
			}
		};

		//when server emits this, set current question to the one sent from server
		Socket.on('send-question-to-all', function(question, index){
			//assign the current question to the question emitted from server, if a question isn't active
			if(!$scope.currentQuestion){
				$scope.currentQuestion = question;
				$scope.currentQuestion.maxTime = question.time;
                $scope.questIndex = index;
			}			
		});
		//when recieving current time from server, set currentQuestions time to it
		Socket.on('current-time-from-server', function(time){
			$scope.currentQuestion.time = time;
		});

		//when server emits this, the timer is done
		//set current question to undefined
		Socket.on('remove-question', function(question){
			$scope.currentQuestion = undefined;
            // Update with the most recently chosen question

		});
		// stops the interval when the scope is destroyed,
		// this usually happens when a route is changed and 
		// the ItemsController $scope gets destroyed. The
		// destruction of the ItemsController scope does not
		// guarantee the stopping of any intervals, you must
		// be responsible of stopping it when the scope is
		// is destroyed.
		$scope.$on('$destroy', function() {
			//only stops timer if is active
			if($scope.currentQuestion){
				$scope.stop();
			}
		});

        $scope.submitAnswer = function(ansId) {
            quizInArray = false;
            questIndex = $scope.questIndex;

            // If there is no stored quiz in User schema, create it
            for(var i in $scope.user.storedAnswers) {
                if ($scope.user.storedAnswers[i].quizId === $scope.quiz._id) {
                    quizInArray = true;
                    quizIndex = i;
                }

            }
            if(!quizInArray) {
                $scope.user.storedAnswers.push({
                    quizId: $scope.quiz._id,
                    answers: []
                });
                //index where this quiz is.
                quizIndex = $scope.user.storedAnswers.length - 1;
            }
            // This checks if a student chooses not to answer one question but then answers the following
            // to maintain order
            while ($scope.user.storedAnswers[quizIndex].answers.length < questIndex) {
                $scope.user.storedAnswers[quizIndex].answers.push(null);
                console.log('never called');
            }

            if ($scope.user.storedAnswers[quizIndex].answers.length === questIndex) {
                $scope.user.storedAnswers[quizIndex].answers.push(ansId);
            }
            // Otherwise, reassign answer
            else {
                $scope.user.storedAnswers[quizIndex].answers[questIndex] = ansId;
            }
            var user = new Users($scope.user);
            console.log(user);
            user.$update(function(response) {
                Authentication.user = response;
            }, function(response) {
                console.log('Update Error: ' + response);
            });
        };

	}
]);
