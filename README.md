# Multiple-Choice-App
CEN3031 (Intro to Software Engineering) Project - A web app to answer quizzes in real time in class.
**(our main progress is on the *Develop* branch)**

###Group Members
* **Sergio Puleri**: spuleri
* **Kevin Wu**: kwu23
* **Dylan Richardson**: goozie001
* **Craig Lu**: CraigLu
* **Chun Fai Kwok**: cfkwok

###Protractor tests  
Install Protractor (follow "Setup" instructions):  
http://angular.github.io/protractor/#/

######Running tests (you will need to do these in seperate terminal tabs/windows)
First start the Selenium Server:
```bash
$ webdriver-manager start
```
Start the application:
```bash
$ grunt
```
Finally, start Protracting!
```bash
$ protractor tests/conf.js
```

######Current tests made:
* Sign up, sign out, sign in  
* Sign in to prof acc, make course  
* While still logged in, it updates the course, makes a quiz, goes to that quiz  
* Remove that course  
* Test if student can join  
* Make a new course while still logged in to prof acc  
* Log out, sign into student acc  
* Join the course  

###Screenshot of current landing page
![alt text](http://i.imgur.com/sEjTM25.png?1 =250x "Landing Page")
