const express = require('express');
const db = require('./database');
const getBoxLocations = require('./endpoints/box-locations');
const createRequest = require('./endpoints/create-request');
const showBoxLocation = require('./endpoints/show-box-location');
const loadBody = require('./middleware/parse-body');
const createSession = require('./endpoints/create-session');
const createUser = require('./endpoints/create-user');
const newUser = require('./endpoints/new-user');
const newSession = require('./endpoints/new-session');
const loadSession = require('./middleware/load-session');
const destroySession = require('./endpoints/destroy-session');
const authorsOnly = require('./middleware/authors-only');
const updateRequest = require('./endpoints/update-request');
const newBoxLocation = require('./endpoints/new-box-location');
const createBoxLocation = require('./endpoints/create-box-location');
const listUsers = require('./endpoints/list-users');
const editUser = require('./endpoints/edit-user');
const updateUser = require('./endpoints/update-user');


var app = express();
app.use(loadSession);

// default page should fetch box locations
app.get('/', getBoxLocations);

// API endpoint to fetch box locations
app.get('/box-locations', getBoxLocations);

// Routes for Rendering a form for creating a new box location
app.get('/box-locations/new', authorsOnly, newBoxLocation);
app.post('/box-locations/new', authorsOnly, loadBody, createBoxLocation);

// Route for listing all users
app.get('/users', authorsOnly, listUsers);

// Route for requesting the form used for editing a user
app.get('/users/:user_id', authorsOnly, editUser);

// Route for updating a user's information
app.post('/users/:user_id', authorsOnly, loadBody, updateUser);

// Show box locations
app.get('/box-locations/:id', showBoxLocation);
app.post('/box-locations/:id/requests', loadBody, createRequest);

// Signup Routes
app.get('/signup', newUser);
app.post('/signup', loadBody, createUser);

// Login Routes
app.get('/login', newSession);
app.post('/login', loadBody, createSession);

// Update Request Route
app.post('/box-locations/box-locations/:box_id/requests/:request_id/fulfill', loadBody, updateRequest);

// Logout Route
app.get('/logout', destroySession);

// Clear requests
app.post('/box-locations/:id/clear-requests', authorsOnly, async (req, res) => {
  const boxId = req.params.id;

  try {
    // Clear all requests for the specified box
    await db.prepare('DELETE FROM requests WHERE box_id = ?').run(boxId);

    res.redirect(`/box-locations/${boxId}`);
  } catch (error) {
    console.error('Error clearing requests:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use(express.static('static'));

module.exports = app;

