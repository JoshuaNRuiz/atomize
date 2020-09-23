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

const requestTokens = async (body) => {
    const grant_type = "authorization_code";
    const code = body.code;
    const redirect_uri = body.redirect_uri;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const url = "https://accounts.spotify.com/api/token/";

    console.log(code);
    console.log(redirect_uri);
    console.log(client_id);
    console.log(client_secret);

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
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParameters
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Error ' + response.status + ":" + response.statusText);
        }
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error);
    });
}

// ************************ API ************************

app.post('/api/get-spotify-tokens', (req, res) => {
    requestTokens(req.body)
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