require('dotenv').config({ path: __dirname + '/.env' });

const DEFAULT_PORT = 8000;
const PORT = process.argv[2] || DEFAULT_PORT;

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2')
const mongodb = require('mongodb');
const uri = 'mongodb+srv://localhost:27017/?maxPoolSize=20&w=majority';

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    next();
});

const host = process.env.DATABASE_HOST;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const connection = mysql.createConnection({
    host, user, password, database
});

require('./api')(app, connection);

//


//

app.get('*', (req, res) => {
    const file = path.join(__dirname, '../client/build/index.html')
    res.sendFile(file);
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})