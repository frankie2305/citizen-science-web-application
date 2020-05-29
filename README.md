# Citizen Science Web Application

This is the Citizen Science Web Application. It contains a
Python based web server that provides a JSON API to the data required for the application.  We can run the Python server with the command:

```python
python main.py
```

This requires Python 3 and the bottle library, I've included bottle with this project so we should not need to download anything other than Python 3.

The server will listen for requests on [http://localhost:8010](http://localhost:8010/).

The main page of the application is generated by the Python code from the file `index.html` in the `views` folder.

Static files are served from the `static` folder, which will have sub-folders for CSS, Javascript and images.

There are a few Javascript files in the project:

* `main.js` is the main entry point and is referenced from the `index.html` file
* `model.js` contains code to retrieve data from the API and methods to make data available to the application in the Model object
* `util.js` provides a utility function that deals with a hash path, which is essential for the views as only 1 HTML page `index.html` will be loaded from the server
* `views.js` has a few view functions to display views to users
* `form.js` has 3 functions responsible for submitting the observation form and showing errors as well as scrolling to the error alert if form submission is unsuccessful
* `tabs.js` has a function to style the current active tab in the navigation bar
* `title.js` has a function to create dynamic titles for different pages

The `cypress` directory contains tests to be run with the [Cypress](https://cypress.io) testing tool.

## The API Server

The Python API server provides the following URLs serving JSON data:

* `/api/users` - GET returns a JSON array of user details
* `/api/users/<id>` - GET returns details of an individual user
* `/api/observations` - GET returns a JSON array of observation records
* `/api/observations` - POST adds a new observation record (required fields below)
* `/api/observations/<id>` - GET returns details of an individual observation
* `/api/reset` - GET request resets the database (for testing purposes)

## The Views

There will be 8 views in the application, these are outlined here. Each page has a specific URL hash as shown here:

* Main Page (`/`): contains some summary information, list of recent observations, current top 10 leaderboard of users and a link to the form to add an observation.  The user and observation entries link to their individual views (User Profile View and Observation Detail View).
* Observation List View (`/#!/observations`): shows the complete list of observations, each observation includes at least the location and weather fields and links to the Observation Detail view.
* Leaderboard View (`/#!/users`): lists the full list of users in order of the number of observations that they have made. Each entry links to the profile view for that user.
* Observation Detail View (`/#!/observations/<id>`): shows the full details of one observation including all fields and also a link to the User Profile View.
* User Profile View (`/#!/users/<id>`): shows the brief details of the user (name, email, avatar) and a complete list of the observations they have made, most recent first, each observation links to the Observation Detail view.
* 404 Error View (`/#!/users/<id>` or `/#!/observations/<id>`): shows a 404 error page if the user or the observation with the id requested does not exist and prompts the user to go back to homepage
* Observation Form (`/#!/submit`): contains the form to submit an observation. The user will fill out the form and submit it. If the form is incomplete, a list of errors will be shown above the form and the user will be able to fix them and resubmit.  If the submission is successful, the user is shown the User Profile View where the new observation will be included in the observation list.
* Error Alert View (`/#!/submit`): shows an error alert when form submission is unsuccessful
