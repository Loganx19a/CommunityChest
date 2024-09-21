const db = require('../database');
const serveError = require('../serve-error');

function updateUser(req, res) {
  const userId = parseInt(req.params.user_id, 10);
  const { email, name, admin } = req.body;

  // Validate the input data
  if (!email || !name) {
    return serveError(req, res, 400, 'Email and name are required');
  }

  // Update the user in the database
  const sql = 'UPDATE users SET email = ?, name = ?, admin = ? WHERE id = ?';
  const info = db.prepare(sql).run(email, name, admin ? 1 : 0, userId);

  if (info.changes !== 1) {
    return serveError(req, res, 500, 'Unable to update user');
  }

  // Redirect to the user's page or the users list
  //res.redirect(`/users/${userId}`);
  res.redirect(`/users`);
}
module.exports = updateUser;