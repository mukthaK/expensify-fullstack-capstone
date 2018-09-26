# Expensify
An application to track the expenses.

## Screenshots
![Landing page](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/homescreen.png "Landing page")
![Landing page additional](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/homescreen-signup.png "Landing page")
![Add Friend screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/friends.png "Add friend screen")
![Add Bill screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/bill.png "Add bill screen")
![Bill settlement screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/billsettlement.png "Bill settlement screen")
![Change password screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/changepswd.png "Change password screen")

## User Cases
This app is designed for individual users who would like to track their spending. Expensify helps in splitting cost of a bill. The app maintains a running total so that you can pay each other at once!

### UI Flow
![UI Flow handwritten draft](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/screenshots/userflow.jpg)

### Wireframe
![Landing page](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/landingPage.jpg "Landing screen") \
![Add Friend screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/friendPage.jpg "Add Friend screen")
![Add Bill screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/billPage.jpg "Add Bill screen")
![Bill settlement screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/youAreOwedPage.jpg "Bill settlement screen")
![Bill settlement screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/youOwePage.jpg "Bill settlement screen")
![Bill view screen](https://github.com/mukthaK/expensify-fullstack-capstone-react/blob/master/github-images/billView.jpg "Bill settlement screen")

## Working Prototype
You can access a working prototype of the app here: https://expensify-capstone.herokuapp.com/

## Functionality
The app's functionality includes:
* Every User has the ability to create an account that stores information unique to them
* User can add bill and add friends
* User can see a summery of who has to pay whom

## Technology
* Front-End: HTML5 | CSS3 | JavaScript ES6 | jQuery | React
* Back-End: Node.js | Express.js | Mocha | Chai | RESTful API Endpoints | MongoDB | Mongoose

## Responsive
App is strongly built to be usuable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* To enable users to update/delete a bill
* Enable reminder notification to user when they have to pay the bill
* Show the activity log of when a bill is added, when amount is settled, etc

#  The typical command lines for capstone projects

## Node command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cors express mongodb mongoose passport passport-http unirest
    * npm install --save-dev chai chai-http mocha faker
* nodemon server.js ==> run node server
* npm test ==> run the tests

## React command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cheerio chokidar-cli concurrently core-js cors cpr enzyme enzyme-react-16-adapter-setup express http-server jsonwebtoken moment mongodb mongoose morgan npm-run-all passport passport-http passport-jwt passport-jwt-strategy react react-addons-test-utils react-dom react-fontawesome react-redux redux redux-thunk rimraf unirest
    * npm install --save-dev acorn babel-cli babel-core babel-loader babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-es2015 babel-preset-react chai chai-enzyme chai-http enzyme-adapter-react-15 enzyme-adapter-react-16 faker json-loader mkdirp mocha react-scripts react-test-renderer sinon sinon-chai webpack
* npm run build ==> build the react files in the "build" folder
* npm start ==> run react server on http://127.0.0.1:8080
* npm test ==> run the tests
