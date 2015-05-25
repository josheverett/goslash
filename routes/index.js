var express = require('express');
var low = require('lowdb');

var router = express.Router(),
    db = low('db.json');

function renderIndex (req, res, next) {
  res.render('index');
}

// Express is dumb and doesn't understand routes that *start* with optional
// capturing groups. So we have to do this.
router.get('/', renderIndex);
router.get('/go(slash)?', renderIndex);

module.exports = router;
