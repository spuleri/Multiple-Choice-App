'use strict';

// Quizzes controller
angular.module('courses').controller('GradesController', ['$scope', '$stateParams', '$location', 'Authentication', '$q', 
	function($scope, $stateParams, $location, Authentication, $q) {
		
		$scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;

       

        $scope.compileGrades = function(){



        	//promise containing only RELEASED quizzes in the class

        	var promise = $scope.loadQuizzes();
        	promise.then(function(quizzes){
        		$scope.grades = [];
        		//only the released quizzes
        		quizzes.forEach(function(quiz){

        			//bool to see if taken quiz, if find quizID in users stored ansers
        			//it will be true if not will be false
        			var taken = false;

        			//finding match, to see if student actually took quiz.
        			$scope.user.storedAnswers.forEach(function(takenQuiz) {

        				//if already found that took the quiz dont need to keep loopin
        				// if(taken){
        				// 	break;
        				// }

        				if(quiz._id.toString() === takenQuiz.quizId.toString()) {
        					taken = true;
        					//calculating users score for this quiz
        					var score = takenQuiz.score;
        					var total = quiz.questions.length;
        					var percent = (score / total)*100;
        					percent = Math.round(percent*10)/10;
        					var questions = [];

        					quiz.questions.forEach(function(question){
        						//looping thru ansers to see if student answers each question
        						//and then putting in what they answerd for the question.
        						question.answeredQuestion = false;

        						question.answers.forEach(function(ans){
        							ans.studentsChosenAnswer = false;
        							

        							takenQuiz.answers.forEach(function(studentAns){

        								if(ans._id.toString() === studentAns.toString()){
        									question.answeredQuestion = true;
        									ans.studentsChosenAnswer = true;

        								}

        							});

        						});

        					});

        					//data for each quiz
        					var data = {
        						taken: taken,
        						score: score,
        						total: total,
        						percent: percent,
        						quiz: quiz,

        					};
        					$scope.grades.push(data);


        				}


        			});

        			//if they didnt take this quiz, push that into the grades array
        			if(!taken){
        				var data = {
        					taken: false
        				};
        				$scope.grades.push(data);

        			}

        		});
				console.log($scope.grades);
        		
        	});
			

        	



        };

        $scope.loadQuizzes = function(){
        	var deferred = $q.defer(); 
        	$scope.course.$promise.then(function(course){


        		$scope.quizzes = course.quizzes;
        		$scope.releasedQuizzes = [];

	        	for (var i = 0; i < $scope.quizzes.length; ++i){

	        		if($scope.quizzes[i].released){

	        			$scope.releasedQuizzes.push($scope.course.quizzes[i]);
	        		}
	        	}
	        	deferred.resolve($scope.releasedQuizzes); 
	        	
       		

        	});
        	return deferred.promise;
        	
        };

        $scope.compileGrades();


	}
]);
