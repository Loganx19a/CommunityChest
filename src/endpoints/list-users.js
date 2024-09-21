const db = require('../database');
const templates = require('../templates');

function listUsers(req, res) {
  const sql = 'SELECT * FROM users';
  const users = db.prepare(sql).all();

  const html = templates['users.html']({ users, user: req.session.user });
  res.send(html);
}
module.exports = listUsers;

