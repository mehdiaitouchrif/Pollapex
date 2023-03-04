const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


module.exports = app