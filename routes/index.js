var express = require('express');
var router = express.Router();

function renderIndex (req, res, next) {
  res.render('index');
}

// Express is dumb and doesn't understand routes that *start* with optional
// capturing groups. So we have to do this.
router.get('/', renderIndex);
router.get('/go(slash)?', renderIndex);

module.exports = router;
