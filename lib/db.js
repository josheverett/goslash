var _ = require('lodash'),
    low = require('lowdb'),

    app = require('../app'),
    api;

api = {
  getLink: function (array, slug) {
    return _.findWhere(array, { slug: slug });
  },
  setLink: function (array, slug, url, overwrite) {
    if (!slug || !url) {
      throw new Error('Missing required parameters.');
    }

    if (_.contains(app.locals.protectedRoutes, slug)) {
      throw new Error('This shortlink cannot be used.');
    }

    var prevLink = api.getLink(array, slug),
        link = prevLink || { slug: slug };

    if (!slug.match(/^\w+$/)) {
      throw new Error('Shortlink must only contain letters, numbers, and underscores.');
    }

    if (prevLink && !overwrite) {
      throw new Error(
        'This shortlink already exists. ' +
        'Please <a href="/' + prevLink.slug + '/edit">edit this shortlink</a> ' +
        'if you\'d like to change its destination.'
      );
    }

    if (prevLink && _.first(prevLink.urls).url === url) {
      throw new Error('Already redirecting to this URL.');
    }

    link.urls = link.urls || [];

    link.urls.unshift({
      url: url,
      clicks: 0,
      datetime: Date.now()
    });

    if (!prevLink) {
      array.push(link);
    }
  }
};

low.mixin(api);

module.exports = low('db.json');
