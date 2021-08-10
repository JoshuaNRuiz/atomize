require('dotenv').config({path: __dirname + '/.env'});

const DEFAULT_PORT = 8000;
const BASE_PATH = process.env.BASE_PATH;
const PORT = process.argv[2] || DEFAULT_PORT;

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cookieParser());

require('./api')(app);

app.get(BASE_PATH + '*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})