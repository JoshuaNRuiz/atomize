require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;

// API

const requestToken = async (body) => {
    const grant_type = "authorization_code";
    const code = body.code;
    const redirect_uri = body.redirect_uri;
    const client_id = body.client_id;
    const client_secret = process.env.KEY;

    const url = "https://accounts.spotify.com/api/token";

    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            'grant_type': grant_type,
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'client_secret': client_secret
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            let pokemon = {
                'name': 'deoxys',
                'number': '386'
            }
            return pokemon;
        }
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error);
    });
}

app.post('/api/spotify-auth', cors(), (req, res) => {
    const body = req.body

    requestToken(body)
    .then(response => {
        res.send(response);
    })
    
});

app.listen(port, () => {
    console.log("server is listening");
    console.log(path.join(__dirname, '../client/public'));
})