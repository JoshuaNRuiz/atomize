const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/user-data/:type', async (req, res) => {
        const type = req.params.type;
        const accessToken = req.cookies.access_token;
        let data = null;

        try {
            if (type === 'playlists') {
                data = await getPlaylists(accessToken);
            } else if (type === 'track') {
                data = await getLikedTracks(accessToken);
            }
        } catch (error) {
            if (error.response.status) res.status(error.response.status);
            data = {error: error.message}
        }
        
        res.send(data);
    });

    async function getPlaylists(accessToken) {
        let playlists = [];

        let options = {
            url: 'https://api.spotify.com/v1/me/playlists',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                limit: 50
            }
        };

        do {
            await axios(options)
                .then(response => {
                    const items = Object.values(response.data.items);
                    playlists.push(...items);
                    options.url = response.data.next;
                });
        } while (options.url !== null);

        playlists.sort((a, b) => { // alphabetize before sending
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            else return 0;
        });

        return { ...playlists };
    };

    async function getLikedTracks(accessToken) {
        let tracks = [];
        let options = {
            url: 'https://api.spotify.com/v1/me/tracks',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                limit: 50
            }
        };

        do {
            await axios(options)
                .then(response => {
                    const items = Object.values(response.data.items);
                    strippedData = items.map(item => item.track);
                    tracks.push(...strippedData);
                    options.url = response.data.next;
                });
        } while (options.url !== null);

        return { ...tracks };
    };

}