const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');

// Controllers
const productsController = require('./controllers/productsController');
const usersController = require('./controllers/usersController');
const walletController = require('./controllers/walletController');

// Set Server port
const port = process.env.PORT || 5000;

mongoose.connect(config.getDbConnectionStrings());

productsController(app);
usersController(app);
walletController(app);

app.listen(port);