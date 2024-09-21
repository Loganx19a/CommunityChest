const db = require('../database');
const serveError = require('../serve-error');

function createBoxLocation(req, res) {
  const { name, latitude, longitude } = req.body;

  // Validate the input data
  if (!name || !latitude || !longitude) {
    return serveError(req, res, 400, 'Name, latitude, and longitude are required');
  }

  // Insert the new box location into the database
  const sql = 'INSERT INTO boxes (name, lat, lng) VALUES (?, ?, ?)';
  const info = db.prepare(sql).run(name, latitude, longitude);

  if (info.changes !== 1) {
    return serveError(req, res, 500, 'Unable to create box location');
  }

  // Redirect to the box details page for the newly created box
  res.redirect(`/box-locations/${info.lastInsertRowid}`);
}

module.exports = createBoxLocation;