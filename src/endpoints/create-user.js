// Code Source: Blog Part 6

const bcrypt = require('bcrypt');
const templates = require('../templates');
const db = require('../database');
const serveError = require('../serve-error');
const sessions = require('../sessions');

/** @function createUser
 * An endpoint for creating a new user.  The request
 * should have an object as its body parameter with 
 * username, password, and passwordConfirmation set.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 */
function createUser(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var passwordConfirmation = req.body.passwordConfirmation;
  var name = req.body.name;

  // Check password and password confirmation match
  if (password !== passwordConfirmation) return failure(req, res, "Your password and password confirmation must match.");

  // Check for existing user
  var existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existingUser) return failure(req, res, `The email "${email}" is already taken.`);

  // Hash the password
  const passes = 10;
  bcrypt.hash(password, passes, (err, hash) => {
    if (err) return serveError(req, res, 500, err);
    // Save user to the database
    var info = db.prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?);").run(email, name, hash);
    if (info.changes === 1) {
      var user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      success(req, res, user);
    }
    else failure(req, res, "An error occurred.  Please try again.");
  });
}
module.exports = createUser;

/** @function success
 * Helper function for creating the user session after 
 * a successful login attempt.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 * @param {object} user - the user who signed in
 */
function success(req, res, user) {
  // Create session
  var sid = sessions.create(user);
  // Set session cookie
  res.setHeader("Set-Cookie", `SID=${sid}; Secure; HTTPOnly`);
  // Redirect to home page
  res.statusCode = 302;
  res.setHeader("Location", "/");
  res.end();
}

/** @function failure 
 * A helper method invoked when user creation fails.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 * @param {string} errorMessage - a message to display to the user
 */
function failure(req, res, errorMessage) {
  if (!errorMessage) errorMessage = "There was an error processing your request.  Please try again."
  var form = templates["signup.html"]({
    errorMessage: errorMessage
  });
  var html = templates["layout.html"]({
    body: form
  });
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", html.length);
  res.end(html);
}