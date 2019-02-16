const moment = require("moment");

module.exports = {
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  postIndex: function(num) {
    return num + 1;
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  numberOfPosts: function(posts) {
    return posts.length;
  },
  numberOfUsers: function(posts) {
    let users = new Set();
    for (let post of posts) {
      users.add(post.user.name);
    }
    return users.size;
  },
  numberOfCategories: function(posts) {
    let categories = new Set();
    for (let post of posts) {
      categories.add(post.category);
    }
    return categories.size;
  }
};
