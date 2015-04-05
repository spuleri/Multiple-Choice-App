# Multiple-Choice-App
CEN3031 (Intro to Software Engineering) Project - A web app to answer quizzes in real time in class.

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
* Sign up as professor
* Make a course
* Make a quiz with questions and answers
* Broadcast quiz and show answers
* Sign out, sign up as student
* Join the course and view the quiz
* Sign out and sign in as professor
* Remove the course

###Screenshot of current landing page
![alt text](http://i.imgur.com/sEjTM25.png?1 =250x "Landing Page")
