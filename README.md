![alt tag](https://raw.githubusercontent.com/spuleri/Multiple-Choice-App/develop/public/modules/core/img/brand/logo.png)
## A web app to answer quizzes in real time in class.
A CEN3031 (Intro to Software Engineering) Project

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

###Screenshots
![joining a course](https://gyazo.com/c939f55051824b3ff76d3dccd4f1f92d.gif)
![course homepage from a professor's view](https://gyazo.com/a5103d5f58fa0db8fd5fdd5ca1159673.png)
![professor broadcasting a question](https://gyazo.com/295be8207550c2cab7e2c443c199e8da.gif)
![student answering a question](https://gyazo.com/c9910d2beafa782b4f0d8b90b0edd9c7.gif)
![student checking grades](https://gyazo.com/58919d37641317a1863c5a8a72a31e4c.gif)

