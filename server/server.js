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

const requestTokens = async (myBody) => {
    const grant_type = "authorization_code";
    const code = myBody.code;
    const redirect_uri = myBody.redirect_uri;
    const client_id = myBody.client_id;
    const client_secret = process.env.KEY;

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

// ************************ CORE ************************ 

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})