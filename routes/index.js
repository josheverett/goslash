var express = require('express');
var db = require('../lib/db');

var router = express.Router(),
    links = db('links');

function renderIndex (req, res, next) {
  res.render('index');
}

function createLink (req, res, next) {
  var verb = req.body.overwrite ? 'changed' : 'added';

  links.setLink(req.body.slug, req.body.url);
  db.save();

  res.locals.alert = {
    type: 'success',
    message: 'Shortlink "' + req.body.slug + '" ' + verb + '!'
  };

  renderIndex(req, res, next);
}

router.use(function (req, res, next) {
  res.locals.links = links.clone().reverse();
  next();
});

// Express is dumb and doesn't understand routes that *start* with optional
// capturing groups. So we have to do this.
router.get('/', renderIndex);
router.get('/go(slash)?', renderIndex);

router.post('/', createLink);

module.exports = router;
