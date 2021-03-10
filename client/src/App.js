import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Navbar from './component/Navbar/Navbar';
import Login from './container/Login/Login';
import Gateway from './component/Gateway/Gateway';
import Analyzer from './container/Analyzer/Analyzer';
import Tracker from './container/Tracker/Tracker';
import Explorer from './container/Explorer/Explorer';

import './App.css'

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAccessTokenValid, setAccessTokenStatus] = useState(false);

    const baseUrl = window.location.origin;

    async function requestTokens(code) {
        const options = {
            url: baseUrl + '/api/spotify-helper/get-tokens',
            method: 'POST',
            data: {
                code: code,
                redirect_uri: baseUrl + '/'
            }
        }

        const response = await axios(options);

        const tokens = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
        }

        return tokens;
    }

    async function renewAccessToken() {
        const options = {
            url: baseUrl + '/api/spotify-helper/renew-access-token',
            method: 'POST',
            data: {
                refresh_token: refreshToken
            }
        }

        const response = await axios(options);

        const accessToken = response.data.access_token;

        return accessToken;
    }

    function hasUserPreviouslyLoggedIn() {
        const localAccessToken = localStorage.getItem('accessToken');
        const localRefreshToken = localStorage.getItem('refreshToken');
        const localTokensExist = !!localAccessToken && !!localRefreshToken;

        const localAccessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime');
        const localAccessTokenExpirationTimeExists = !!localAccessTokenExpirationTime;

        const userPreviouslyLoggedIn = (localAccessTokenExpirationTimeExists && localTokensExist);
        return userPreviouslyLoggedIn;
    }

    function setTokens(tokens) {
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;

        setAccessToken(accessToken);
        localStorage.setItem('accessToken', accessToken);

        setRefreshToken(refreshToken);
        localStorage.setItem('refreshToken', refreshToken);

        const accessTokenExpirationTime = Math.floor((Date.now() / 1000) + 3600);
        localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
    }

    // managing users logged in state
    useEffect(() => {
        const userPreviouslyLoggedIn = hasUserPreviouslyLoggedIn();
        if (userPreviouslyLoggedIn) {
            setAccessToken(localStorage.getItem('accessToken'));
            setRefreshToken(localStorage.getItem('refreshToken'));
            setLoginStatus(true);
        } else {
            localStorage.clear();

            const parameters = window.location.search;
            const code = new URLSearchParams(parameters).get('code');
            const codeIsInParameters = !!code;

            if (codeIsInParameters && !isLoggedIn) {
                requestTokens(code)
                    .then(tokens => {
                        setTokens(tokens);
                        setLoginStatus(true);
                    })
                    .catch(error => {
                        console.error(error);
                        alert(error.message);
                    });
            }
        }
    }, []);

    // manage the expired access token state
    useEffect(() => {
        if (isLoggedIn) {
            const currentTime = Date.now() / 1000;
            const accessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime');
            const accessTokenExpired = currentTime > accessTokenExpirationTime;

            const localRefreshToken = localStorage.getItem('refreshToken');

            if (accessTokenExpired && !!localRefreshToken) {
                renewAccessToken()
                    .then(accessToken => {
                        setAccessToken(accessToken);
                        const accessTokenExpirationTime = Math.floor((Date.now() / 1000) + 3600);
                        localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    });

    let container = isLoggedIn ? Gateway : Login;
    const tracker = () => <Tracker accessToken={accessToken} />
    const analyzer = () => <Analyzer accessToken={accessToken} />

    return (
        <Router>
            <div className="App" > {
                isLoggedIn ? <Navbar /> : null
            }

                <Switch>
                    <Route path='/' exact component={container} />
                    <Route path='/analyze' render={analyzer} />
                    <Route path='/top' component={tracker} />
                    <Route path='/explorer' component={Explorer} />
                </Switch> </div>
        </Router>

    );
}

export default App;