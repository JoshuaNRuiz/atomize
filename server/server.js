require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const qs = require('qs');
const axios = require('axios').default;

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// ************************ API ************************

app.get('/api/get-id', (req, res) => {
    res.send(process.env.API_ID);
});

// ************************ AUTHORIZATION ************************

app.post('/api/spotify-helper/get-tokens', async (req, res) => {
    const code = req.body.code;
    const redirectUri = req.body.redirect_uri;
    const response = await requestTokens(code, redirectUri);
    res.send(response);
});

async function requestTokens(code, redirect_uri) {
    const url = "https://accounts.spotify.com/api/token";
    const authorization = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
    const grant_type = 'authorization_code';
    const data = {
        'grant_type': grant_type,
        'code': code,
        'redirect_uri': redirect_uri,
    };

    try {
        const response = await axios(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorization
            },
            data: qs.stringify(data)
        });
        return response.data;
    } catch (error) {
        return {
            error: error.message
        };
    }
}

// ************************ RENEWING ACCESS TOKENS ************************

app.post('/api/spotify-helper/renew-access-token', async (req, res) => {
    const refreshToken = req.body.refresh_token;
    const response = await renewAccessToken(refreshToken);
    res.send(response);
});

async function renewAccessToken(refreshToken) {
    const url = 'https://accounts.spotify.com/api/token';
    const authorization = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
    const grantType = 'refresh_token';

    const options = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authorization
        },
        data: qs.stringify({
            grant_type: grantType,
            refresh_token: refreshToken
        }),
    }

    const data = await axios(options)
        .then(response => response.data)
        .catch(error => {
            console.log(error.name + " " + error.message);
            return {
                error: error.message
            }
        })

    return data;
}

// ************************ GETTING TOP TRACKS/ARTISTS ************************ 

app.post('/api/spotify-helper/top-:type', async (req, res) => {
    const type = req.params.type;
    const accessToken = req.body.access_token
    const timeRange = req.body.time_range;
    const limit = req.body.limit;
    const offset = req.body.offset;

    const response = await getTop(type, accessToken, timeRange, limit, offset);
    res.send(response);
});

async function getTop(type, accessToken, timeRange, limit, offset) {
    if (type == 'artists' || type == 'tracks') {
        let url = 'https://api.spotify.com/v1/me/top/';
        url += `${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const response = await axios.get(url, options)
            .then(response => response.data)
            .catch(error => {
                return {
                    error: error.message
                }
            });

        return response;
    }
};

// ************************ GETTING USER PLAYLISTS ************************ 

app.post('/api/spotify-helper/user-playlists', async (req, res) => {
    const accessToken = req.body.access_token;
    try {
        const data = await getPlaylists(accessToken);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({});
    }
});

async function getPlaylists(accessToken) {
    let items = [];
    try {
        let url = 'https://api.spotify.com/v1/me/playlists';
        const options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                limit: 50
            }
        }

        do {
            const response = await axios.get(url, options)
                .catch(error => {
                    throw error;
                });
            let responseItems = Object.values(response.data.items);
            items.push(...responseItems);
            url = response.data.next;
        } while (url !== null);

        items.sort((a, b) => { // alphabetize before sending
            if (a.name < b.name) return -1;
            if (a.name < b.name) return 1;
            else return 0;
        })
    } catch (error) {
        console.log(error);
    }
    return {
        ...items
    };
}

// ************************ GETTING TRACK INFO ************************ 

app.post('/api/spotify-helper/tracks/:infotype', async (req, res) => {
    const infotype = req.params.infotype;
    const accessToken = req.body.access_token;
    const ids = req.body.ids;

    let url = 'https://api.spotify.com/v1/'

    if (infotype === 'general') {
        url += 'tracks';
    } else if (infotype === 'audio-features') {
        url += 'audio-features';
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                ids: ids
            }
        });
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.send({});
    }
});

app.post('/api/spotify-helper/tracks/:infotype/:id', async (req, res) => {
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

app.post('/api/spotify-helper/liked-tracks', async (req, res) => {
    const accessToken = req.body.access_token;
    const data = await getLikedTracks(accessToken);
    res.send(data);
});

async function getLikedTracks(accessToken) {
    let tracks = [];
    let url = 'https://api.spotify.com/v1/me/tracks';
    const options = {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        params: {
            limit: 50
        }
    }

    do {
        const response = await axios(url, options)
            .then(response => {
                for (const value of Object.values(response.data.items)) {
                    tracks.push(value.track);
                }
                url = response.data.next;
                return response;
            })
            .catch(error => {
                if (error.response) {
                    const serverError = error.response.data.error;
                    const time = new Date(Date.now()).toLocaleTimeString();
                    console.error(`[${time}]: ${serverError.status} ${serverError.message}`);
                }
                return {
                    error: error.response.data
                };
            });

        if (response.error) break;
    } while (url !== null);

    return {
        ...tracks
    };
};

// ************************ GETTING  AUDIO FEATURES ************************ 

app.post('/api/spotify-helper/audio-features', async (req, res) => {
    const accessToken = req.body.access_token;
    const ids = req.body.track_ids;
    const response = await getAudioFeatures(accessToken, ids);
    res.send(response);
});

async function getAudioFeatures(accessToken, ids) {
    let items = []
    try {
        const url = 'https://api.spotify.com/v1/audio-features/';
        let options = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }
        let trackIds = '';
        let startIndex = 0;
        let endIndex = 0;
        while (startIndex <= ids.length) {
            endIndex = startIndex + 100 > ids.length ? ids.length : startIndex + 100;
            trackIds = ids.slice(startIndex, endIndex).join(',');
            options.params = {
                ids: trackIds
            }
            const response = await axios.get(url, options);
            const responseItems = Object.values(response.data.audio_features);
            items.push(...responseItems);
            startIndex += 100;
        }
        return {
            ...items
        };
    } catch (error) {
        console.log(error.name + " " + error.message);
        return {
            error: error.message
        };
    }
}

// ************************ CORE ************************ 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})