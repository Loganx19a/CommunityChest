const db = require('../database');
const templates = require('../templates');

function getBoxLocations(req, res) {
  var sql = db.prepare('SELECT * FROM boxes').all(); // get all boxes
  var boxes = [];
  sql.forEach(box=>{
    boxes.push(templates["location.html"](box))
  });
  var html = templates["homepage.html"]({user: req.session.user, boxes: boxes})
  res.setHeader('Content-Type', "text/html");
  res.setHeader('Content-Length', html.length);
  res.end(html);
}

module.exports = getBoxLocations;