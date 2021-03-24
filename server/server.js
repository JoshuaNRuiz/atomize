require('dotenv').config({path: __dirname + '/.env'});

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const qs = require('qs');
const axios = require('axios').default;
const cors = require('cors');

const NetworkError = require('./model/Errors/NetworkError');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const basePath = process.env.BASE_PATH

// ************************ API ************************

app.get('/api/get-id', (req, res) => {
    res.send(process.env.API_ID);
});

// ************************ AUTHORIZATION ************************

app.post(basePath + '/api/spotify-helper/get-tokens', async (req, res) => {
    const code = req.body.code;
    const redirectUri = req.body.redirect_uri;

    const data = await requestTokens(code, redirectUri)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
});

async function requestTokens(code, redirect_uri) {
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
            'redirect_uri': redirect_uri,
        })
    };

    const data = await axios(options)
        .then(response => response.data);

    return data;
}

// ************************ RENEWING ACCESS TOKENS ************************

app.post(basePath + '/api/spotify-helper/renew-access-token', async (req, res) => {
    const refreshToken = req.body.refresh_token;

    const data = await renewAccessToken(refreshToken)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
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

// ************************ GETTING TOP TRACKS/ARTISTS ************************ 

app.post(basePath + '/api/spotify-helper/top-:type', async (req, res) => {
    const type = req.params.type;
    const accessToken = req.body.access_token
    const timeRange = req.body.time_range;
    const limit = req.body.limit;
    const offset = req.body.offset;

    const data = await getTop(type, accessToken, timeRange, limit, offset)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
});

async function getTop(type, accessToken, timeRange, limit, offset) {
    if (type == 'artists' || type == 'tracks') {
        const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;

        const options = {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const data = await axios(options)
            .then(response => response.data);

        return data;
    }
};

// ************************ GETTING USER PLAYLISTS ************************ 

app.post(basePath + '/api/spotify-helper/user-playlists', async (req, res) => {
    const accessToken = req.body.access_token;

    const data = await getPlaylists(accessToken)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data)
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

    items.sort((a, b) => { // alphabetize before sending
        if (a.name < b.name) return -1;
        if (a.name < b.name) return 1;
        else return 0;
    });

    return playlists;
}

// ************************ GETTING TRACK INFO ************************ 

app.post(basePath + '/api/spotify-helper/tracks/:infotype', async (req, res) => {
    const infotype = req.params.infotype;
    const accessToken = req.body.access_token;
    const ids = req.body.ids;

    let url = 'https://api.spotify.com/v1/';

    if (infotype === 'general') {
        url += 'tracks';
    } else if (infotype === 'audio-features') {
        url += 'audio-features';
    }

    const options = {
        url: url,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        params: {
            ids: ids
        }
    }

    const data = await axios(options)
        .then(response => response.data)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
});

app.post(basePath + '/api/spotify-helper/tracks/:infotype/:id', async (req, res) => {
    const infotype = req.params.infotype;
    const id = req.params.id;
    const accessToken = req.body.access_token;

    let url = 'https://api.spotify.com/v1/'

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

    const response = await axios.get(url, options)
        .catch(error => {
            return error;
        });

    res.send(response.data);
});

app.post(basePath + '/api/spotify-helper/liked-tracks', async (req, res) => {
    const accessToken = req.body.access_token;
    const data = await getLikedTracks(accessToken)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
});

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

// ************************ GETTING  AUDIO FEATURES ************************ 

app.post(basePath + '/api/spotify-helper/audio-features', async (req, res) => {
    const accessToken = req.body.access_token;
    const ids = req.body.track_ids;
    const data = await getAudioFeatures(accessToken, ids)
        .catch(error => {
            return {
                error: error.message,
                status: error.response.status
            }
        });

    const status = data.error ? data.status : 200;

    res.status(status).send(data);
});

async function getAudioFeatures(accessToken, ids) {
    let audioFeatureData = []

    let options = {
        url: 'https://api.spotify.com/v1/audio-features/',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        params: {ids: ''}
    }

    let trackIds = '';
    let startIndex = 0;
    let endIndex = 0;

    while (startIndex <= ids.length) {
        endIndex = startIndex + 100 > ids.length ? ids.length : startIndex + 100;
        trackIds = ids.slice(startIndex, endIndex).join(',');
        options.params.ids = trackIds;

        await axios(options)
            .then(response => {
                const audioFeatures = response.data.audio_features;
                audioFeatureData.push(...audioFeatures);
                startIndex += 100;
            })
    }

    return audioFeatureData;
}

// ************************ CORE ************************ 

app.get(basePath + '*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})