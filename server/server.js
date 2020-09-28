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

// ************************ API ************************

app.post('/api/get-spotify-tokens', (req, res) => {
    const code = req.body.code;
    const redirectUri = req.body.redirect_uri;

    requestTokens(code, redirectUri)
    .then(response => {
        res.send(response);
    })
});

app.get('/api/get-id', (req, res) => {
    res.send(process.env.API_ID);
});

// ************************ CORE ************************ 

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})