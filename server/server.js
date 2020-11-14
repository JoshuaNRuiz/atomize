require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const qs = require('qs');
const e = require('express');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const requestTokens = async (code, redirect_uri) => {
    const grant_type = 'authorization_code';
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const url = "https://accounts.spotify.com/api/token";

    const bodyParameters = qs.stringify({
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret
    });

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParameters
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error(response.status);
        }
    })
    .catch(error => console.log(error));
}

//TODO: FIX THIS
const renewAccessToken = async (refreshToken) => {
    const url = 'https://accounts.spotify.com/api/token';
    const bodyParameters = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token, refreshToken
    });

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const authorization = qs.stringify(client_id + ':' + client + client_secret);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authorization
        },
        body: bodyParameters
    })
    .then(response => response.ok ? response.json() : new Error(response.status))
}

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
        .then (response => response.ok ? response.json() : new Error(response.status))
        .catch(error => console.log(error));
    }
};

// ************************ API ************************

app.get('/api/get-id', (req, res) => {
    res.send(process.env.API_ID);
});

app.post('/api/spotify-helper/get-tokens', (req, res) => {
    const code = req.body.code;
    const redirectUri = req.body.redirect_uri;

    requestTokens(code, redirectUri)
    .then(data => {
        res.send(data);
    })
});

app.post('/api/spotify-helper/renew-auth-token', (req, res) => {
    const refreshToken = req.body.refresh_token;

    renewAccessToken(refreshToken)
    .then(data => {
        res.send(data);
    })
});

app.post('/api/spotify-helper/top-:type', (req, res) => {
    const type = req.params.type;
    const accessToken = req.body.access_token
    const timeRange = req.body.time_range;
    const limit = req.body.limit;
    const offset = req.body.offset;

    getTop(type, accessToken, timeRange, limit, offset)
    .then(data => {
        res.send(data);
    })
});

// ************************ CORE ************************ 

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})