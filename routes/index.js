var express = require('express');
var db = require('../lib/db');

var router = express.Router(),
    links = db('links');

function renderIndex (req, res, next) {
  res.render('index', {
    links: links
  });
}

// Express is dumb and doesn't understand routes that *start* with optional
// capturing groups. So we have to do this.
router.get('/', renderIndex);
router.get('/go(slash)?', renderIndex);

module.exports = router;
