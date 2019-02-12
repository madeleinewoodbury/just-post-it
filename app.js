const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

// Load Routes
const index = require("./routes/index");
const user = require("./routes/user");

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use Routes
app.use("/", index);
app.use("/user", user);

const port = 5500;
app.listen(port, () => console.log(`Server started on port ${port}...`));
