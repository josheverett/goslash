var _ = require('lodash'),
    express = require('express'),
    qs = require('querystring'),

    db = require('../lib/db'),

    router = express.Router(),
    links = db('links');

function health (req, res, next) {
  res.json({ 'wow': 'such health' });
}

function renderIndex (req, res, next) {
  res.render('index');
}

function renderIndexAlert (res, type, message) {
  res.redirect('/?' + qs.stringify({
    alertType: type,
    alertMessage: message
  }));
}

function renderEdit (req, res, next) {
  res.render('edit');
}

function renderStats (req, res, next) {
  var link = links.getLink(req.params.slug);

  if (!link) {
    next();
    return;
  }

  res.render('stats', { urls: link.urls });
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

  renderIndexAlert(res, 'success',
    'Shortlink "' + req.body.slug + '" ' + verb + '!');
}

function deleteLink (req, res, next) {
  var link = links.getLink(req.body.slug),
      index;

  if (!link) {
    throw new Error('This shortlink does not exist.');
  }

  links.remove({ slug: link.slug });

  renderIndexAlert(res, 'success',
    'Shortlink <b>' + link.slug + '</b> deleted!');
}

router.use(function (req, res, next) {
  res.locals.links = links.clone().reverse();

  if (req.query.alertType) {
    res.locals.alert = {
      type: req.query.alertType,
      message: req.query.alertMessage
    };
  }

  next();
});

// Express is dumb and doesn't understand routes that *start* with optional
// capturing groups. So we have to do this.
router.get('/', renderIndex);
router.get('/go(slash)?', renderIndex);

router.get('/health', health);

router.get('/:slug/edit', renderEdit);
router.get('/:slug/stats', renderStats);
router.get('/:slug', redirect);

router.post('/', createLink);
router.post('/edit', createLink);
router.post('/delete', deleteLink);

module.exports = router;
