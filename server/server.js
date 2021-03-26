require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const app = express();
const path = require('path');

const BASE_PATH = process.env.BASE_PATH;

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());

/* INCLUDE THE API LIBRARY */
require('./api')(app);

app.get(BASE_PATH + '*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})