const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

// Load Routes
const index = require("./routes/index");

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use Routes
app.use("/", index);

const port = 5500;
app.listen(port, () => console.log(`Server started on port ${port}...`));
