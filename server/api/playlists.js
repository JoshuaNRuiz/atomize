const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/playlist/:id', async (req, res) => {
        const playlistId = req.params.id;
        const accessToken = req.cookies.access_token;

        const data = await getPlaylistTracks(accessToken, playlistId)
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

    async function getPlaylistTracks(accessToken, playlistId) {
        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=100`;

        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const data = await axios.get(url, options)
            .then(response => response.data);
        
        return data;
    }

}