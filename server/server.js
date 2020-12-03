require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const qs = require('qs');
const axios = require('axios').default;

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// ************************ API ************************

app.get('/api/get-id', (req, res) => {
    res.send(process.env.API_ID);
});

// ************************ AUTHORIZATION ************************

app.post('/api/spotify-helper/get-tokens', (req, res) => {
    const code = req.body.code;
    const redirectUri = req.body.redirect_uri;

    requestTokens(code, redirectUri)
    .then(data => res.send(data))
});

const requestTokens = async (code, redirect_uri) => {
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
        console.log(error);
    }
}


// ************************ RENEWING ACCESS TOKENS ************************

app.post('/api/spotify-helper/renew-access-token', (req, res) => {
    const refreshToken = req.body.refresh_token;

    renewAccessToken(refreshToken)
    .then(data => res.send(data));
});

const renewAccessToken = async (refreshToken) => {
    const url = 'https://accounts.spotify.com/api/token';
    const authorization = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
    const data = {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
    };

    try {
        const response = await axios(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authorization
            },
            data: qs.stringify(data)
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

// ************************ GETTING TOP TRACKS/ARTISTS ************************ 

app.post('/api/spotify-helper/top-:type', (req, res) => {
    const type = req.params.type;
    const accessToken = req.body.access_token
    const timeRange = req.body.time_range;
    const limit = req.body.limit;
    const offset = req.body.offset;

    getTop(type, accessToken, timeRange, limit, offset)
    .then(data => res.send(data))
});

const getTop = async (type, accessToken, timeRange, limit, offset) => {
    if (type == 'artists' || type == 'tracks') {
        let url = 'https://api.spotify.com/v1/me/top/';
        url += `${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
        })
        .then (response => response.ok ? response.json() : {})
        .catch(error => console.log(error));
    }
};

// ************************ GETTING USER PLAYLISTS ************************ 

app.post('/api/spotify-helper/user-playlists', (req, res) => {
    const accessToken = req.body.access_token;

    getPlaylists(accessToken)
    .then(data => res.send(data));
});

const getPlaylists = async (accessToken) => {
    const url = 'https://api.spotify.com/v1/me/playlists';
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

// ************************ GETTING TRACK INFO ************************ 

app.post('/api/spotify-helper/tracks', async (req, res) => {
    const accessToken = req.body.access_token;
    let payload = null;
    let method = null;

    if (!!req.body.id) {
        payload = req.body.id;
        method = getTrack;
    } else if (!!req.body.ids) {
        payload = req.body.ids;
        method = getMultipleTracks;
    } else {
        throw new Error('the id\'s were not specified')
    }

    try {
        const data = await method(accessToken, payload);
        res.send(data);
    } catch (error) {
        console.log(erorr);
        res.send({});
    }
});

const getTrack = async (accessToken, id) => {
    const url = `https://api.spotify.com/v1/tracks/${id}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getMultipleTracks = async (accessToken, ids) => {
    const url = `https://api.spotify.com/v1/tracks`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                ids: ids
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// ************************ CORE ************************ 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})