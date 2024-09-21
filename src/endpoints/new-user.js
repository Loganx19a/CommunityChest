const templates = require('../templates');

module.exports = function(req, res) {
  var form = templates["signup.html"]({
    errorMessage: ""
  });
  var html = templates["layout.html"]({
    user: req.session.user,
    body: form
  });
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", html.length);
  res.end(html);
}