const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  comments: {
    type: [
      {
        commentBody: {
          type: String,
          require: true
        },
        commentDate: {
          type: Date,
          default: Date.now
        },
        commentUser: {
          type: Schema.Types.ObjectId,
          ref: "users"
        }
      }
    ]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("posts", PostSchema);
