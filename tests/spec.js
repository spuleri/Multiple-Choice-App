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

var newUserName = makeid();

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
		ufid.sendKeys(49875243);
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
    	element(by.id('username')).sendKeys('fai');
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
    	element(by.id('username')).sendKeys('fai_s');
    	element(by.id('password')).sendKeys('abcd1234');
    	element(by.buttonText('Sign in')).click();

    	// Join the course
    	element(by.id('headerCourses')).click();
    	element(by.partialButtonText('JOIN')).click();
    	element(by.model('selectedCourse')).sendKeys('TestCourse', protractor.Key.ENTER);
    	element(by.id('insertedCCode')).sendKeys('123');
    	element(by.id('joinSubmit')).click();
    	browser.sleep(1500);
	});


});
