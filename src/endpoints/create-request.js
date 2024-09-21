const db = require('../database');
const serveError = require('../serve-error');
const sanitizeHTML = require('sanitize-html');

function createRequest(req, res) {
    const id = parseInt(req.params.id, 10);
    var requestText = req.body.request;
    var user = req.session.user;  // Ensure the user is logged in

    const sanitizedRequestText = sanitizeHTML(requestText);
    const sql = 'INSERT INTO requests (box_id, user_id, request, fulfilled) VALUES (?, ?, ?, ?)';
    const info = db.prepare(sql).run(id, user.id, sanitizedRequestText, 0);

    if (info.changes !== 1) {
        return serveError(req, res, 500, 'Unable to create request');
    }
    // redirects to prev page
    res.writeHead(302, {"Location": `/box-locations/${id}`}).end() 
}

module.exports = createRequest;
