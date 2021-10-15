module.exports = function (app) {
    require('./api/authorization')(app);
    require('./api/tracks')(app);
    require('./api/audio-features')(app);
    require('./api/user-data')(app);
    require('./api/search')(app);
    require('./api/top-data')(app);
}