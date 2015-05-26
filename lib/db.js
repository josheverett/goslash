var _ = require('lodash'),
    low = require('lowdb'),
    urlLib = require('url'),

    api;

api = {
  getLink: function (array, slug) {
    return _.findWhere(array, { slug: slug });
  },
  setLink: function (array, slug, url, overwrite) {
    if (!slug || !url) {
      throw new Error('Missing required parameters.');
    }

    // Need to require app here due to circular dependencies.
    var app = require('../app'),
        prevLink = api.getLink(array, slug),
        link = prevLink || { slug: slug },
        parsed = urlLib.parse(url);

    // As this project shows, pretty much anything can be a valid URL (hence no
    // server-side validation). We need to ensure that URLs such as "foo" are not
    // treated as local URL paths, but other servers. So if the URL lacks a
    // protocol, we'll prepend "http://" to it.
    if (!parsed.protocol) {
      url = 'http://' + url;
    }

    if (_.contains(app.locals.protectedRoutes, slug)) {
      throw new Error('This shortlink cannot be used.');
    }

    if (!slug.match(/^\w+$/)) {
      throw new Error('Shortlink must only contain letters, numbers, and underscores.');
    }

    if (!(slug.length >= 2 && slug.length <= 20)) {
      throw new Error('Shortlink must be between 2 and 20 characters.');
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
