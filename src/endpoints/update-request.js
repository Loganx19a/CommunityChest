const db = require('../database');
const serveError = require('../serve-error');
const sanitizeHTML = require('sanitize-html');


function updateRequest(req, res) {
    const id = parseInt(req.params.box_id, 10);
    const request_id = parseInt(req.params.request_id, 10);
    var user = req.session.user;  // Ensure the user is logged in

    const sql = 'UPDATE requests SET fulfilled = 1 WHERE id = ?';
    const info = db.prepare(sql).run(request_id);

    if (info.changes !== 1) {
        return serveError(req, res, 500, 'Unable to create request');
    }
    // redirects to prev page
    res.writeHead(302, {"Location": `/box-locations/${id}`}).end() 
}
module.exports = updateRequest;
