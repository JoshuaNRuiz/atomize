const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/tracks/:id', async (req, res) => {
        const id = req.params.id;
        const url = `https://api.spotify.com/v1/tracks/${id}`;
        const accessToken = req.cookies.access_token;

        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const data = await axios.get(url, options)
            .then(response => {
                res.status(200);
                return response.data
            })
            .catch(error => {
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
                }
            });

        res.send(data);
    });

    app.get('/api/spotify-helper/tracks/:infotype', async (req, res) => {
        const infotype = req.params.infotype;
        const accessToken = req.cookies.access_token;
        const ids = req.body.ids;

        let url = 'https://api.spotify.com/v1/';

        if (infotype === 'general') {
            url += 'tracks';
        } else if (infotype === 'audio-features') {
            url += 'audio-features';
        }

        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                ids: ids
            }
        }

        const data = await axios.get(url, options)
            .then(response => {
                res.status(200);
                return response.data;
            })
            .catch(error => {
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
                }
            });

        res.send(data);
    });

    app.get('/api/spotify-helper/tracks/:infotype/:id', async (req, res) => {
        const infotype = req.params.infotype;
        const id = req.params.id;
        const accessToken = req.cookies.access_token;

        let url = 'https://api.spotify.com/v1/';

        if (infotype === 'general') {
            url += `tracks/${id}`;
        } else if (infotype === 'audio-features') {
            url += `audio-features/${id}`;
        } else if (infotype === 'audio-analysis') {
            url += `audio-analysis/${id}`
        }

        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const data = await axios.get(url, options)
            .then(response => {
                res.status(200);
                return response.data;
            })
            .catch(error => {
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message
                }
            });

        res.send(data);
    });
}