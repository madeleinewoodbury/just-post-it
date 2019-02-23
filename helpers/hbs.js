const moment = require("moment");
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
require("../models/Post");
const Post = mongoose.model("posts");

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
  },
  registeredUsers: function() {
    let numOfUsers;
    User.find().then(users => {
      for (let user of users) {
        numOfUsers++;
      }
      return numOfUsers;
    });
  },
  arrLength: function(arr) {
    return arr.length;
  },
  postsPerCategory: function(category) {
    let categoryArr = [];
    Post.find().then(posts => {
      for (let post of posts) {
        if (post.category === category) {
          categoryArr.push(post.category);
        }
      }
      return categoryArr.length;
    });
  }
};
