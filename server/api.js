module.exports = function (app, connection) {
    require('./api/authorization')(app, connection);
    require('./api/tracks')(app, connection);
    require('./api/audio-features')(app, connection);
    require('./api/user-data')(app), connection;
    require('./api/search')(app, connection);
    require('./api/top-data')(app, connection);
}