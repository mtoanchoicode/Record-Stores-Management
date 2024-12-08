const express = require("express");
const methodOverride = require("method-override")
const bodyParser = require('body-parser')
const flash = require("express-flash")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const multer = require("multer")

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const systemConfig = require("./config/system")

// Change Path methopd
app.use(methodOverride('_method'))

// Conenct database
const database = require("./config/database");
database.connect();

//body parser
app.use(bodyParser.urlencoded({extended: false}))

//embed Route
const routeAdmin = require("./Routers/admin/index.route")
const route = require("./Routers/client/index.route")

// Configure PUG
app.set('views', './views');
app.set('view engine', 'pug');

// Initialize Flash
app.use(cookieParser("10042005"))
app.use(session({cookie:{maxage:60000}}))
app.use(flash())

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

// Configure static file
app.use(express.static("public"));

// Routes
route(app);
routeAdmin(app);


app.listen(port, ()=>{
    console.log(`App listens on port ${port}`);
});