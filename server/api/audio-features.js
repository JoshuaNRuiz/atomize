const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.post('/api/spotify-helper/audio-features', async (req, res) => {
        const accessToken = req.cookies.access_token;
        const ids = req.body.track_ids;
        const data = await getAudioFeatures(accessToken, ids)
            .then(response => {
                res.status(200);
                return response;
            })
            .catch(error => {
                console.error(error);
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
                }
            });
        
        res.send(data);
    });

    async function getAudioFeatures(accessToken, ids) {
        let audioFeatureData = []
        let url = 'https://api.spotify.com/v1/audio-features/'
        let options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: { ids: '' }
        }

        let trackIds = '';
        let startIndex = 0;
        let endIndex = 0;

        while (startIndex <= ids.length) {
            endIndex = startIndex + 100 > ids.length ? ids.length : startIndex + 100;
            trackIds = ids.slice(startIndex, endIndex).join(',');
            options.params.ids = trackIds;

            await axios.get(url, options)
                .then(response => {
                    const audioFeatures = response.data.audio_features;
                    audioFeatureData.push(...audioFeatures);
                    startIndex += 100;
                })
        }

        return audioFeatureData;
    }

    app.get('/api/spotify-helper/audio-features/:id', async (req, res) => {
        const accessToken = req.cookies.access_token;
        const id = req.params.id;
        const data = await getTrackAudioFeatures(accessToken, id)
            .then(response => {
                res.status(200);
                return response;
            })
            .catch(error => {
                console.error(error);
                if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
                }
            });
        
        res.send(data);
    });

    async function getTrackAudioFeatures(accessToken, id) {
        const url = `https://api.spotify.com/v1/audio-features/${id}`
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