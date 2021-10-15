require('dotenv').config({ path: __dirname + '/.env' });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const qs = require('qs');
const axios = require('axios').default;

module.exports = function(app) {

    app.get('/api/spotify-helper/get-tokens', async (req, res) => {
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
                // if (error.response.status) res.status(error.response.status);
                return {
                    error: error.message,
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

    app.get('/api/spotify-helper/renew-access-token', async (req, res) => {
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

}