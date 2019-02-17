const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ImageSchema = new Schema({
  path: {
    type: String,
    required: true
  }
});

mongoose.model("images", ImageSchema);
