// spec.js
/*
describe('angularjs homepage', function() {
	var firstNumber = element(by.model('first'));
	var secondNumber = element(by.model('second'));
	var goButton = element(by.id('gobutton'));
	var latestResult = element(by.binding('latest'));

	beforeEach(function() {
    	browser.get('http://juliemr.github.io/protractor-demo/');		
	});

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Super Calculator');
  });

  it('should add one and two', function() {
  	firstNumber.sendKeys(1);
  	secondNumber.sendKeys(2);
  	goButton.click();
  	expect(latestResult.getText()).toEqual('3');
  });

  it('should add four and six', function() {
  	firstNumber.sendKeys(4);
  	secondNumber.sendKeys(6);
  	goButton.click();
  	expect(latestResult.getText()).toEqual('10');
  })
});
*/
// Thanks giodelatorre1
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var professorUserName = makeid();
var studentUserName = makeid();
var courseName = makeid();

describe('signup as professor', function() {
    it('should be able to connect to the webapp', function() {
        browser.get('http://localhost:3000/');
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
    });
    it('should go to the signup page', function() {
        element(by.id('headerSignUp')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/signup');
    });
    it('should be able to access all input fields', function() {
        element(by.id('firstName')).sendKeys('Gregory');
        element(by.id('lastName')).sendKeys('House');
        element(by.id('email')).sendKeys('bestdoctorna@gg.com');
        element(by.id('username')).sendKeys(professorUserName);
        element(by.id('password')).sendKeys('professor');
        element(by.id('ufid')).sendKeys('12345678');
        element(by.id('gatorlink')).sendKeys('ghouse');
        element(by.id('toggleProf')).click();
        element(by.buttonText('Sign up')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
    });
});

describe('create a course', function(){
    it('should be able to go to courses list', function() {
        element(by.id('headerCourses')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/courses');
    });
    it('should be able to create a course', function() {
        element(by.buttonText('Create a Course')).click();
    	element(by.id('name')).sendKeys(courseName);
    	element(by.id('courseCode')).sendKeys('123');
    	element(by.id('modalCreateSubmit')).click();
        expect(element(by.binding('course.name')).getText()).toEqual(courseName);	
    }); 
});

describe('create and broadcast a quiz', function(){
    it('should be able to make a quiz', function() {
        element(by.linkText('Quizzes')).click();
        element(by.id('addQuiz')).click();
        element(by.id('quiz')).sendKeys('Quiz for Sprint 3');
        element.all(by.model('question.title')).get(0).sendKeys('Question 1');
        element.all(by.model('question.description')).get(0).sendKeys('2+2=X');
        element.all(by.model('answer.name')).get(0).sendKeys('X=4');
        element.all(by.model('answer.name')).get(1).sendKeys('X=2');
        element.all(by.model('answer.name')).get(2).sendKeys('X=6');
        element.all(by.model('answer.name')).get(3).sendKeys('X=5');
        element.all(by.model('answer.name')).get(4).sendKeys('X=3');
        element.all(by.model('answer.valid')).get(0).click();
        element.all(by.id('newQuestion')).get(0).click();
        element.all(by.model('question.title')).get(1).sendKeys('Question 2');
        element.all(by.model('question.description')).get(1).sendKeys('3+5=X');
        element.all(by.model('answer.name')).get(5).sendKeys('X=4');
        element.all(by.model('answer.name')).get(6).sendKeys('X=3');
        element.all(by.model('answer.name')).get(7).sendKeys('X=8');
        element.all(by.model('answer.name')).get(8).sendKeys('X=5');
        element.all(by.model('answer.name')).get(9).sendKeys('X=1');
        element.all(by.model('answer.valid')).get(7).click();
        element(by.id('create')).click();
        expect(element(by.binding('course.name')).getText()).toEqual(courseName);	
    });
    it('should be able to broadcast quiz', function() {
        element(by.linkText('Quizzes')).click();
        element(by.binding('quiz.name')).click();
        expect(element(by.binding('quiz.name')).getText()).toEqual('Quiz for Sprint 3');
        element.all(by.id('questionTime')).get(0).clear();
        element.all(by.id('questionTime')).get(0).sendKeys('30');
        element.all(by.id('broadcast')).get(0).click();
        browser.sleep(2000);
        element.all(by.id('release')).get(1).click();
        browser.sleep(3500);
        element.all(by.id('endQuiz')).get(0).click();
        browser.sleep(1000);
    });
});
describe('signup as student', function() {
    it('should be able to signout of professor', function() {
        element(by.binding('authentication.user.displayName')).click();
        element(by.id('dropdownSignOut')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
    });
    it('should go to the signup page', function() {
        element(by.id('headerSignUp')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/signup');
    });
    it('should be able to access input fields', function() {
        element(by.id('firstName')).sendKeys('Student');
        element(by.id('lastName')).sendKeys('Student');
        element(by.id('email')).sendKeys('student@student.com');
        element(by.id('username')).sendKeys(studentUserName);
        element(by.id('password')).sendKeys('student');
        element(by.id('ufid')).sendKeys('12345678');
        element(by.id('gatorlink')).sendKeys('student');
        element(by.buttonText('Sign up')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
    });
    it('should be able to join a course', function() {
        element(by.id('headerCourses')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/courses');
    	element(by.partialButtonText('Join')).click();
    	element(by.model('selectedCourse')).sendKeys(courseName, protractor.Key.ENTER);
    	element(by.id('insertedCCode')).sendKeys('123');
    	element(by.id('joinSubmit')).click();
        expect(element(by.binding('course.name')).getText()).toEqual(courseName);	
        browser.sleep(2000);
    });
    it('should be able to view a quiz', function() {
        element(by.linkText('Quizzes')).click();
        expect(element(by.binding('course.name')).getText()).toEqual(courseName);
        element(by.binding('quiz.name')).click();
        expect(element(by.binding('quiz.name')).getText()).toEqual('Quiz for Sprint 3');	
    });
});

describe('delete the course', function(){
    it('should be able to signout as student', function() {
        element(by.binding('authentication.user.displayName')).click();
        element(by.id('dropdownSignOut')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
    });
    it('should be able to sign in as professor',function(){
        element(by.id('headerSignIn')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/signin');
        element(by.id('username')).sendKeys(professorUserName);
        element(by.id('password')).sendKeys('professor');
        element(by.buttonText('Sign in')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
        element(by.id('headerCourses')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/courses');
        element(by.binding('course.name')).click();
        expect(element(by.binding('course.name')).getText()).toEqual(courseName);	
        element(by.id('removeCourse')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/courses');
        element(by.binding('authentication.user.displayName')).click();
        element(by.id('dropdownSignOut')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');
        browser.sleep(2000);
    });
});

/*
    it('', function() {
        
    });
*/


/*
describe('signup page', function() {
	var firstName = element(by.id('firstName'));
	var lastName = element(by.id('lastName'));
	var email = element(by.id('email'));
	var username = element(by.id('username'));
	var password = element(by.id('password'));
	var ufid = element(by.id('ufid'));
	var gatorlink = element(by.id('gatorlink'));
	var professor = element(by.id('toggleProf'));
	var signUp = element(by.buttonText('Sign up'));

	it('should sign up successfully with new user, sign out, and sign back in', function() {
		browser.get('http://localhost:3000/');
		element(by.id('headerSignUp')).click();
		firstName.sendKeys('Gregory');
		lastName.sendKeys('House');
		email.sendKeys('bestdoctorna@gg.com');
		username.sendKeys(newUserName);
		password.sendKeys('abcd1234');
		ufid.sendKeys('4987-5243');
		gatorlink.sendKeys('ghouse');
		professor.click();
		signUp.click();

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');

		element(by.binding('authentication.user.displayName')).click();
		element(by.id('dropdownSignOut')).click();

		element(by.id('headerSignIn')).click();
		username.sendKeys(newUserName);
		password.sendKeys('abcd1234');
		element(by.buttonText('Sign in')).click();

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/#!/');

		browser.sleep(1000);

		element(by.binding('authentication.user.displayName')).click();
		element(by.id('dropdownSignOut')).click();

		browser.sleep(1500);

	});

	
});

describe('site functionality after log', function() {
	beforeEach(function() {
    	browser.get('http://localhost:3000/#!/');
	});

	it('should be able to sign in as a professor and make a course', function() {
		element(by.id('headerSignIn')).click();
    	element(by.id('username')).sendKeys('fai1');
    	element(by.id('password')).sendKeys('abcd1234');
    	element(by.buttonText('Sign in')).click();
    	element(by.id('headerCourses')).click();
    	element(by.buttonText('Create a Course')).click();
    	element(by.id('name')).sendKeys('CEN3031');
    	element(by.id('courseCode')).sendKeys('123');
    	element(by.id('modalCreateSubmit')).click();
		expect(element(by.binding('course.name')).getText()).toEqual('CEN3031');	
    	browser.sleep(2000);

	});

	it('should be able to update the name of the course and make quizzes as a professor', function () {
    	element(by.id('headerCourses')).click();

    	element(by.binding('course.name')).click();
    	expect(element(by.binding('course.name')).getText()).toEqual('CEN3031');

    	element(by.id('editCourse')).click();

    	element(by.id('name')).clear();
    	element(by.id('name')).sendKeys('What Do You MEAN?');
    	element(by.id('quiz')).sendKeys('Final Game');
    	element(by.css('.btn')).click();
    	expect(element(by.binding('course.name')).getText()).toEqual('What Do You MEAN?');
    	//element(by.cssContainingText('.nav', 'Quizzes')).click();
    	element(by.linkText('Quizzes')).click();
    	element(by.binding('quiz.name')).click();
    	browser.sleep(1500);
	});

	it('should be able to remove the course as a professor', function() {
		element(by.id('headerCourses')).click();
		element(by.binding('course.name')).click();
		element(by.id('removeCourse')).click();
		browser.sleep(2000);
	});

	it('should make a new course with professr account, and a student can join the course', function() {
		// Make course on prof acc
    	element(by.id('headerCourses')).click();
    	element(by.buttonText('Create a Course')).click();
    	element(by.id('name')).sendKeys('TestCourse');
    	element(by.id('courseCode')).sendKeys('123');
    	element(by.id('modalCreateSubmit')).click();
		expect(element(by.binding('course.name')).getText()).toEqual('TestCourse');

		// Signout and signin for student acc
		element(by.binding('authentication.user.displayName')).click();
		element(by.id('dropdownSignOut')).click();
		element(by.id('headerSignIn')).click();
    	element(by.id('username')).sendKeys('fai4');
    	element(by.id('password')).sendKeys('abcd1234');
    	element(by.buttonText('Sign in')).click();

        browser.sleep(4000);
    	// Join the course
    	element(by.id('headerCourses')).click();
    	element(by.partialButtonText('Join')).click();
    	element(by.model('selectedCourse')).sendKeys('TestCourse', protractor.Key.ENTER);
    	element(by.id('insertedCCode')).sendKeys('123');
    	element(by.id('joinSubmit')).click();
    	browser.sleep(1500);
	});
    
    it('should be able to make a quiz and a question', function() {
            element(by.binding('authentication.user.displayName')).click();
            element(by.id('dropdownSignOut')).click();
            element(by.id('headerSignIn')).click();
            element(by.id('username')).sendKeys('fai1');
            element(by.id('password')).sendKeys('abcd1234');
            element(by.buttonText('Sign in')).click();
            browser.sleep(4000);
            element(by.id('headerCourses')).click();
            element(by.binding('course.name')).click();
            element(by.linkText('Quizzes')).click();
            element(by.id('addQuiz')).click();
            element(by.id('quiz')).sendKeys('Quiz #2 for Sprint 2');
            element.all(by.model('question.title')).get(0).sendKeys('Question 1');
            element.all(by.model('question.description')).get(0).sendKeys('2+2=X');
            element.all(by.model('answer.name')).get(0).sendKeys('X=4');
            element.all(by.model('answer.name')).get(1).sendKeys('X=2');
            element.all(by.model('answer.name')).get(2).sendKeys('X=6');
            element.all(by.model('answer.name')).get(3).sendKeys('X=5');
            element.all(by.model('answer.name')).get(4).sendKeys('X=3');
            element.all(by.model('answer.valid')).get(0).click();
            element.all(by.id('newQuestion')).get(0).click();
            element.all(by.model('question.title')).get(1).sendKeys('Question 2');
            element.all(by.model('question.description')).get(1).sendKeys('3+5=X');
            element.all(by.model('answer.name')).get(5).sendKeys('X=4');
            element.all(by.model('answer.name')).get(6).sendKeys('X=3');
            element.all(by.model('answer.name')).get(7).sendKeys('X=8');
            element.all(by.model('answer.name')).get(8).sendKeys('X=5');
            element.all(by.model('answer.name')).get(9).sendKeys('X=1');
            element.all(by.model('answer.valid')).get(7).click();
            element(by.id('create')).click();
            element(by.linkText('Quizzes')).click();
            element(by.binding('quiz.name')).click();
            element.all(by.id('questionTime')).get(0).clear();
            element.all(by.id('questionTime')).get(0).sendKeys('10');
            element.all(by.id('broadcast')).get(0).click();
            browser.sleep(11000);
	});
    
    //was giving error before if you did the protractor test twice in a row, this fixes it because before it wasnt deleting the testcourse
    	it('should be able to log out of student and into professor and delete testCourse', function() {
            //Signout of student
            element(by.binding('authentication.user.displayName')).click();
            element(by.id('dropdownSignOut')).click();
            element(by.id('headerSignIn')).click();
            //sign into professor
            element(by.id('username')).sendKeys('fai1');
            element(by.id('password')).sendKeys('abcd1234');
            element(by.buttonText('Sign in')).click();
            element(by.id('headerCourses')).click();
            element(by.binding('course.name')).click();
            expect(element(by.binding('course.name')).getText()).toEqual('TestCourse');
            //remove testcourse
		    element(by.id('removeCourse')).click();
            //logout
            element(by.binding('authentication.user.displayName')).click();
            element(by.id('dropdownSignOut')).click();
            browser.sleep(2000);
	});

});
*/