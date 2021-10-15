require('dotenv').config({path: __dirname + '/.env'});

const DEFAULT_PORT = 8000;
const PORT = process.argv[2] || DEFAULT_PORT;

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    next();
});

require('./api')(app);

app.get('*', (req, res) => {
    const file = path.join(__dirname, '../client/build/index.html')
    res.sendFile(file);
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})