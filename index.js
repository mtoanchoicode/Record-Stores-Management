const express = require("express");
var path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

const systemConfig = require("./config/system");

// Change Path methopd
app.use(methodOverride("_method"));

// Conenct database
const database = require("./config/database");
database.connect();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//embed Route
const routeAdmin = require("./Routers/admin/index.route");
const route = require("./Routers/client/index.route");

// Configure PUG
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Initialize Flash
app.use(cookieParser("10042005"));
app.use(session({ cookie: { maxage: 60000 } }));
app.use(flash());

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Configure static file
app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`App listens on port ${port}`);
});
