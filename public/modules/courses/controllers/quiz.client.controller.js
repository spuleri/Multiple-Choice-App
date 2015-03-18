'use strict';

// Quizzes controller
angular.module('courses').controller('QuizController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', '$modal', '$log', 'Users', 'SubFinder', 'Socket', '$interval',
	function($scope, $stateParams, $location, Authentication, Courses, $modal, $log, Users, SubFinder, Socket, $interval) {
		$scope.authentication = Authentication;
        $scope.subFinder = SubFinder;

        //testing websocket on course creation
		Socket.on('course.created', function(course) {
		    console.log(course);
		});

		//sample questions
		$scope.questions = [
		{
			question: 'Q1',
			time: 60,
			maxTime: undefined
		},
		{
			question: 'Q2',
			time: 60,
			maxTime: undefined
		},
		{
			question: 'Q3',
			time: 60,
			maxTime: undefined
		},
		{
			question: 'Q4',
			time: 60,
			maxTime: undefined
		},
		{
			question: 'Q5',
			time: 60,
			maxTime: undefined
		}
		];


		//another websocket test with button click on quiz page
		$scope.testSocket = function(question){
			// tell server to start question
			Socket.emit('start-question', question); 
			console.log('i emitted on front end');
			var timer = $interval(function(){
				question.time--;
				//every interval emit the current time so students can see time left
				Socket.emit('current-time', question.time);
				if(question.time === 0){
					//tell server to end question
					Socket.emit('end-question', question);
					$scope.stop();
				}				
				console.log(question.time);
			}, 1000);
			//will execute function, every second until time is 0.

			// stops the interval
			$scope.stop = function() {
			  $interval.cancel(timer);
			};
		};
		
		Socket.on('send test back', function(data){
			console.log('i got it from the server');			
			$scope.testySocket = data;
		});
		
		$scope.addTime = function(question){
			question.time = question.time + 15;
		};
		$scope.subtractTime = function(question){
			question.time = question.time - 15;
		};

		//when server emits this, set current question to the one sent from server
		Socket.on('send-question-to-all', function(question){
			//assign the current question to the question emitted from server
			$scope.currentQuestion = question;
			$scope.currentQuestion.maxTime = question.time;

			console.log('the max time is: ' + $scope.currentQuestion.maxTime);
			
		});
		//when recieving current time from server, set currentQuestions time to it
		Socket.on('current-time-from-server', function(time){
			$scope.currentQuestion.time = time;
		});

		//when server emits this, the timer is done
		//set current question to undefined
		Socket.on('remove-question', function(question){
			$scope.currentQuestion = undefined;
		});
		// stops the interval when the scope is destroyed,
		// this usually happens when a route is changed and 
		// the ItemsController $scope gets destroyed. The
		// destruction of the ItemsController scope does not
		// guarantee the stopping of any intervals, you must
		// be responsible of stopping it when the scope is
		// is destroyed.
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

	}
]);
