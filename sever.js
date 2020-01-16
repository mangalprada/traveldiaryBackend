const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// serve static assets normally

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const citiesRouter = require('./routes/cityRoute');
//const sitesRouter = require('./routes/siteRoute');

app.use('/', citiesRouter);
//app.use('/', sitesRouter);

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
