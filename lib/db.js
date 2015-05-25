var low = require('lowdb');

low.mixin({
  getLink: function (array, slug) {
    return array.findWhere({ slug: slug });
  },
  setLink: function (array, newLink) {
    if (!newLink.slug || !newLink.url) {
      throw new Error('Missing required parameters.');
    }

    var prevLink = array.getLink(link.slug),
        link = prevLink || newLink;

    if (prevLink && !newLink.overwrite) {
      throw new Error(
        'This shortlink already exists. ' +
        'Please <a href="/' + prevLink.slug + '/edit">edit this shortlink</a> ' +
        'if you\'d like to change its destination.'
      );
    }

    if (prevLink && prevLink.urls[0].url === newLink.url) {
      throw new Error('Already redirecting to this URL.');
    }

    link.clicks = link.clicks || 0;
    link.urls = link.urls || [];

    link.urls.unshift({
      slug: newLink.slug,
      url: newLink.url,
      clicks: 0,
      datetime: Date.now()
    });

    if (prevLink) {
      array.save();
    } else {
      array.push(link);
    }
  }
});

module.exports = low('db.json');
