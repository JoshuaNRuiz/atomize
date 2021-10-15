const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/search', async (req, res) => {
        const accessToken = req.cookies.access_token;
        const query = req.query.q;
        const type = req.query.type;

        const data = await searchSpotify(accessToken, query, type)
            .then(response => {
                res.status(200);
                return response;
            })
            .catch(error => {
                console.error(error.message);
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
                }
            });
        
        res.send(data);
    });

    async function searchSpotify(accessToken, query, type) {
        const encodedQuery = encodeURIComponent(query)
        const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=${type}&limit=10`;

        const options = {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }

        const data = await axios.get(url, options)
            .then(response => response.data)

        return data;
    }
    
}