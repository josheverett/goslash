var _ = require('lodash'),
    express = require('express'),
    url = require('url'),

    db = require('../lib/db'),

    router = express.Router(),
    links = db('links');

function renderIndex (req, res, next) {
  res.render('index');
}

function redirect (req, res, next) {
  var link = links.getLink(req.params.slug),
      targetUrl, parsed;

  if (!link) {
    next();
    return;
  }

  targetUrl = _.first(link.urls).url;
  parsed = url.parse(targetUrl);

  // As this project shows, pretty much anything can be a valid URL (hence no
  // server-side validation). We need to ensure that URLs such as "foo" are not
  // treated as local URL paths, but other servers. So if the URL lacks a
  // protocol, we'll prepend "http://" to it.
  if (!parsed.protocol) {
    targetUrl = 'http://' + targetUrl;
  }

  res.redirect(targetUrl);
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

router.get('/:slug', redirect);

router.post('/', createLink);

module.exports = router;
