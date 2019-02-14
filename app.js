const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Load Routes
const index = require("./routes/index");
const user = require("./routes/user");

// DB Config & Connect to mongoose
// const db = require("./config/database");
mongoose
  .connect("mongodb://localhost/blogen-dev", {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use("/", index);
app.use("/user", user);

const port = 5500;
app.listen(port, () => console.log(`Server started on port ${port}...`));
