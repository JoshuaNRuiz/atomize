import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from './helpers/Cookies';

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

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const BASE_PATH = process.env.REACT_APP_BASE_PATH;

    // ************************ MANAGE USER LOGGED IN STATE ************************

    useEffect(handleLoginState, []);

    function handleLoginState() {
        const accessTokenCookie = Cookies.get('access_token');
        const refreshTokenCookie = Cookies.get('refresh_token');
        if (accessTokenCookie) {
            setLoginStatus(true);
            setAccessToken(Cookies.get('access_token'));
            setRefreshToken(Cookies.get('refresh_token'));
        } else if (refreshTokenCookie) { 
            renewAccessToken(refreshTokenCookie)
                .then(token => {
                    setAccessToken(token);
                    Cookies.set('access_token', token);
                })
                .catch(error => {
                    console.log('error' + error);
                });
        } else {
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
    }

    async function renewAccessToken(token) {
        const options = {
            url: BASE_URL + '/api/spotify-helper/renew-access-token',
            method: 'POST',
            data: {
                refresh_token: token
            }
        }

        const accessToken = await axios(options)
            .then(response => response.data.access_token);

        return accessToken;
    }

    async function requestTokens(code) {
        const options = {
            url: BASE_URL + '/api/spotify-helper/get-tokens',
            method: 'POST',
            data: {
                code: code,
                redirect_uri: BASE_URL + '/'
            }
        }

        const data = await axios(options)
            .then(response => response.data);

        const tokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token
        }

        return tokens;
    }

    function setTokens(tokens) {
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    }

    // ************************ CORE ************************

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path={BASE_PATH + '/'}>
                        {isLoggedIn ? Gateway : Login}
                    </Route>

                    <Route path={BASE_PATH + '/analyze'}>
                        <Analyzer accessToken={accessToken} />
                    </Route>

                    <Route path={BASE_PATH + '/top'}>
                        <Tracker accessToken={accessToken} />
                    </Route>

                    <Route path={BASE_PATH + '/explore'}>

                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

export default App;