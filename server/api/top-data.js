const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/top-:type', async (req, res) => {
        const type = req.params.type;
        const accessToken = req.cookies.access_token
        const timeRange = req.query.time_range;
        const limit = req.query.limit;
        const offset = req.query.offset;

        const data = await getTop(type, accessToken, timeRange, limit, offset)
            .then(data => {
                res.status(200);
                return data;
            })
            .catch(error => {
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message
                }
            });

        res.send(data);
    });

    async function getTop(type, accessToken, timeRange, limit, offset) {
        if (type == 'artists' || type == 'tracks') {
            const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }

            const data = await axios.get(url, options)
                .then(response => response.data);

            return data;
        }
    };

}