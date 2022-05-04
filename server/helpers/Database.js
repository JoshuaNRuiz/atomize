const mysql = require('mysql2');
const mongodb = require('mongodb');

class Database {
    constructor(host, user, password, database = null) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    getConnection() {
        try {
            const connection = mysql.createConnection({
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.database
            });
        } catch (error) {

        }

        return connection;
    }
}