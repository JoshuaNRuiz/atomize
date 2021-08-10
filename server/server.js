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
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./api')(app);

app.get(BASE_PATH + '*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})