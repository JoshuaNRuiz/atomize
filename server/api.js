require('dotenv').config({ path: __dirname + '/.env' });

const qs = require('qs');
const axios = require('axios').default;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BASE_PATH = process.env.BASE_PATH;
const REDIRECT_URI = process.env.REDIRECT_URI;

module.exports = function (app) {

    // ************************ API ************************

    app.get('/api/get-id', (req, res) => {
        res.send(process.env.API_ID);
    });

    // ************************ AUTHORIZATION ************************

    app.get(BASE_PATH + '/api/spotify-helper/get-tokens', async (req, res) => {
        const code = req.query.code;

        const data = await requestTokens(code)
            .then(data => {
                const [accessToken, expirationTime, refreshToken]= extractData(data);
                res.cookie('access_token', accessToken, { maxAge: expirationTime * 1000 });
                res.cookie('refresh_token', refreshToken);
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

    async function requestTokens(code) {
        const authorization = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

        const options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorization
            },
            data: qs.stringify({
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': REDIRECT_URI
            })
        };

        const data = await axios(options)
            .then(response => response.data);

        return data;
    }

    // ************************ RENEWING ACCESS TOKENS ************************

    app.get(BASE_PATH + '/api/spotify-helper/renew-access-token', async (req, res) => {
        const refreshToken = req.cookies.refresh_token;

        const data = await renewAccessToken(refreshToken)
            .then(data => {
                const [accessToken, expirationTime] = extractData(data);
                res.cookie('access_token', accessToken, { maxAge: expirationTime * 1000 });
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

    async function renewAccessToken(refreshToken) {
        const authorization = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

        const options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorization
            },
            data: qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }),
        };

        const data = await axios(options)
            .then(response => response.data);

        return data;
    }

    function extractData(data) {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        const expirationTime = data.expires_in;

        return [
            accessToken, 
            expirationTime, 
            refreshToken ? refreshToken : null
        ];
    }

    // ************************ GETTING TOP TRACKS/ARTISTS ************************ 

    app.get(BASE_PATH + '/api/spotify-helper/top-:type', async (req, res) => {
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

    // ************************ GETTING USER DATA ************************ 

    app.get(BASE_PATH + '/api/spotify-helper/user-data/:type', async (req, res) => {
        const type = req.params.type;
        const accessToken = req.cookies.access_token;
        let data = null;

        try {
            if (type === 'playlist') {
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

    // ************************ GETTING TRACK INFO ************************ 

    app.get(BASE_PATH + '/api/spotify-helper/tracks/:infotype', async (req, res) => {
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

    app.get(BASE_PATH + '/api/spotify-helper/tracks/:infotype/:id', async (req, res) => {
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

    // playlist info

    app.get(BASE_PATH + '/api/spotify-helper/playlist/:id', async (req, res) => {
        const id = req.params.id;
        const accessToken = req.cookies.access_token;

        
        let url = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=0&limit=100`;

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

    async function getPlaylistTracks(accessToken) {
        
    }

    // ************************ GETTING AUDIO FEATURES ************************ 

    app.post(BASE_PATH + '/api/spotify-helper/audio-features', async (req, res) => {
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
}