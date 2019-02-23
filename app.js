const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const app = express();

// Load Routes
const index = require("./routes/index");
const user = require("./routes/user");
const post = require("./routes/post");
const upload = require("./routes/upload");

// Passport Config
require("./config/passport")(passport);

// Handlebars Helpers
const {
  formatDate,
  postIndex,
  select,
  stripTags,
  numberOfPosts,
  numberOfUsers,
  numberOfCategories,
  registeredUsers,
  arrLength,
  postsPerCategory
} = require("./helpers/hbs");

const db = require("./config/database");
// const mongoURI = "mongodb://localhost/blogen-dev";
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      formatDate: formatDate,
      postIndex: postIndex,
      select: select,
      stripTags: stripTags,
      numberOfPosts: numberOfPosts,
      numberOfUsers: numberOfUsers,
      numberOfCategories: numberOfCategories,
      registeredUsers: registeredUsers,
      arrLength: arrLength,
      postsPerCategory: postsPerCategory
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride("_method"));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Express-Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware gos here
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

// Use Routes
app.use("/", index);
app.use("/user", user);
app.use("/post", post);
app.use("/upload", upload);

const port = 5500;
app.listen(port, () => console.log(`Server started on port ${port}...`));
