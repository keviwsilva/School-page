const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors"); 
const path = require('path');

const router = express.Router();
const app = express();

app.use(cors());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/uploads', express.static('uploads'));



const PORT = process.env.PORT || 5001;

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});


require("./src/controllers/authControlle")(app);
require("./src/controllers/postController")(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;

