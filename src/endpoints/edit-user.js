const db = require('../database');
const templates = require('../templates');

function editUser(req, res) {
  const userId = parseInt(req.params.user_id, 10);

  const sql = 'SELECT * FROM users WHERE id = ?';
  const user = db.prepare(sql).get(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const html = templates['edit-user.html']({ user });
  res.send(html);
}
module.exports = editUser;