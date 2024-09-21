const db = require('../database');
const templates = require('../templates');

function showBoxLocation(req, res) {
  const id = parseInt(req.params.id);

  const sql = `
    SELECT boxes.id, boxes.name, boxes.lat, boxes.lng, requests.request, requests.fulfilled
    FROM boxes
    LEFT JOIN requests ON boxes.id = requests.box_id
    WHERE boxes.id = ?
  `;
  const sql2 = `
    SELECT *  
    FROM requests
    WHERE box_id = ?
  `;
  const rows = db.prepare(sql).all(id);
  const requests = db.prepare(sql2).all(id);


  if (rows.length === 0) {
    return res.status(404).send('Box not found');
  }

  const boxDetails = rows[0];
  // const requests = rows.filter(row => row.request !== null);

  const html = templates['box-location.html']({ box: boxDetails, requests, user: req.session.user });
  res.send(html);
}

module.exports = showBoxLocation;