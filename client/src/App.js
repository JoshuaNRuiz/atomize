import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';

import Navbar from './component/Navbar/Navbar';
import Login from './container/Login/Login';
import Gateway from './component/Gateway/Gateway';
import Analyzer from './container/Analyzer/Analyzer';
import Tracker from './container/Tracker/Tracker';
import Explorer from './container/Explorer/Explorer';

import './App.css'

function App() {
    const history = useHistory();

    const tracker = () => <Tracker accessToken={accessToken} />
    const analyzer = () => <Analyzer accessToken={accessToken} />

    const [isLoggedIn, setLoginStatus] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAccessTokenValid, setAccessTokenStatus] = useState(false);

    const baseUrl = process.env.REACT_APP_ENVIRONMENT;
    const basePath = process.env.REACT_APP_BASE_PATH;

    // ************************ MANAGE USER LOGGED IN STATE ************************

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

    function hasUserPreviouslyLoggedIn() {
        const localAccessToken = localStorage.getItem('accessToken');
        const localRefreshToken = localStorage.getItem('refreshToken');
        const localTokensExist = !!localAccessToken && !!localRefreshToken;

        const localAccessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime');
        const localAccessTokenExpirationTimeExists = !!localAccessTokenExpirationTime;

        const userPreviouslyLoggedIn = (localAccessTokenExpirationTimeExists && localTokensExist);
        return userPreviouslyLoggedIn;
    }

    function getTokens() {

    }

    async function requestTokens(code) {
        console.log(baseUrl);
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

    function setTokens(tokens) {
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;

        setAccessToken(accessToken);
        localStorage.setItem('accessToken', accessToken);

        setRefreshToken(refreshToken);
        localStorage.setItem('refreshToken', refreshToken);

        const accessTokenExpirationTime = Math.floor((Date.now()) + 3600000);
        localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
    }

    // ************************ MANAGE EXPIRED TOKEN STATE ************************

    useEffect(() => {
        if (isLoggedIn) {
            const accessTokenExpired = hasAccessTokenExpired();
            const localRefreshToken = localStorage.getItem('refreshToken');
            if (accessTokenExpired && !!localRefreshToken) {
                console.error("Your access token has expired. Trying to renew.");
                renewAccessToken()
                    .then(accessToken => {
                        setAccessToken(accessToken);
                        const accessTokenExpirationTime = Math.floor((Date.now()) + 3600000);
                        localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (accessTokenExpired && !localRefreshToken) {
                localStorage.clear();
                setLoginStatus(false);
            }
        }
    });

    function hasAccessTokenExpired() {
        const currentTime = Date.now();
        const accessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime');
        if (!accessTokenExpirationTime) return true;

        const accessTokenExpired = currentTime > accessTokenExpirationTime;

        return accessTokenExpired;
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

    // ************************ CORE ************************

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path={basePath + '/'}>
                        {isLoggedIn ? Gateway : Login}
                    </Route>

                    <Route path={basePath + '/analyze'}>
                        <Analyzer accessToken={accessToken} />
                    </Route>

                    <Route path={basePath + '/top'}>
                        <Tracker accessToken={accessToken} />
                    </Route>

                    <Route path={basePath + '/explore'}>

                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

export default App;