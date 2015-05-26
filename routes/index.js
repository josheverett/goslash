var _ = require('lodash'),
    express = require('express'),

    db = require('../lib/db'),

    router = express.Router(),
    links = db('links');

function renderIndex (req, res, next) {
  res.render('index');
}

function renderEdit (req, res, next) {
  res.render('edit');
}

function redirect (req, res, next) {
  var link = links.getLink(req.params.slug),
      url;

  if (!link) {
    next();
    return;
  }

  url = _.first(link.urls);

  url.clicks++;
  db.save();

  res.redirect(url.url);
}

function createLink (req, res, next) {
  var verb = req.body.overwrite ? 'changed' : 'added';

  links.setLink(req.body.slug, req.body.url, req.body.overwrite);
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

router.get('/:slug/edit', renderEdit);
router.get('/:slug', redirect);

router.post('/', createLink);
router.post('/edit', createLink);

module.exports = router;
