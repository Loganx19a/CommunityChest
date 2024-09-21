const serveError = require('../serve-error');

/** @function authorsOnly 
 * This middleware prevents access to a route by users without the author role
 * If a user is not signed in, it will redirect them to the sign in route
 * If they are signed in and are not authors, a 403 unautorized error will be served
 * @param {http.IncomingRequest} req - the request object 
 * @param {http.ServerResponse} res - the response object 
 * @param {function} next - a callback to invoke when the request is fulfillable
 */
function authorsOnly(req, res, next) {
  var session = req.session;
  if(!req.session.user) return res.writeHead(302, {Location: "/login"}).end();
  if(req.session.user.admin === 1) next();
  else serveError(req, res, 403, `Invalid user attempted to use access an admin only page`);
}

module.exports = authorsOnly;