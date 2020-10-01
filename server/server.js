require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const qs = require('qs');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// this method requires a code received from spotify
// and a redirect_uri that is specified in the app
const requestTokens = async (code, redirect_uri) => {
    const grant_type = "authorization_code";
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const url = "https://accounts.spotify.com/api/token/";

    const bodyParameters = qs.stringify({
        grant_type: grant_type,
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret
    });

    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParameters
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Error ' + response.status + ":" + response.statusText);
            return null;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

const getTracks = async (accessToken, timeRange, limit, offset) => {
    let url = 'https://api.spotify.com/v1/me/top/tracks';
    url += `?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
    })
    .then (response => {
        if (response.ok) {
            console.log('response sent from server');
            return response.json();
        } else {
            console.log('did not get a response from servers');
            return null;
        }
    })
};

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
        .then (response => response.ok ? response.json() : null);
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

// app.post('/api/spotify-helper/top-tracks', (req, res) => {
//     const accessToken = req.body.access_token
//     const timeRange = req.body.time_range;
//     const limit = req.body.limit;
//     const offset = req.body.offset;

//     getTracks(accessToken, timeRange, limit, offset)
//     .then(data => {
//         res.send(data);
//     })
// });

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