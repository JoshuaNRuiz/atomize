import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
    const [isLoggedIn, setLoginStatus] = useState(null);

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const BASE_PATH = process.env.REACT_APP_BASE_PATH;

    useEffect(handleLoginState, []);

    function handleLoginState() {
        const accessTokenCookie = Cookies.get('access_token');
        const refreshTokenCookie = Cookies.get('refresh_token');
        if (accessTokenCookie && !isLoggedIn) {
            setLoginStatus(true);
        } else if (refreshTokenCookie) {
            renewAccessToken()
                .then(accessToken => {
                    Cookies.set('access_token', accessToken);
                    setLoginStatus(true);
                });
        } else {
            const parameters = window.location.search;
            const code = new URLSearchParams(parameters).get('code');
            const codeIsInParameters = !!code;

            if (codeIsInParameters && !isLoggedIn) {
                requestTokens(code)
                    .then(tokens => {
                        Cookies.set('access_token', tokens.access_token);
                        Cookies.set('refresh_token', tokens.refresh_token);
                        setLoginStatus(true);
                    })
            }
        }
    }

    async function renewAccessToken(token) {
        const url = BASE_URL + '/api/spotify-helper/renew-access-token';
        const accessToken = await axios.get(url)
            .then(response => response.data.access_token);
        return accessToken;
    }

    async function requestTokens(code) {
        const url = BASE_URL + '/api/spotify-helper/get-tokens';
        const options = {
            params: {
                code: code
            }
        }

        const tokens = await axios.get(url, options)
            .then(response => response.data)
            .then(data => {
                return {
                    access_token: data.access_token,
                    refresh_token: data.refreshToken
                }
            });

        return tokens;
    }

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path={BASE_PATH + '/'}>
                        {isLoggedIn ? Gateway : Login}
                    </Route>

                    <Route path={BASE_PATH + '/analyze'}>
                        <Analyzer />
                    </Route>

                    <Route path={BASE_PATH + '/top'}>
                        <Tracker />
                    </Route>

                    <Route path={BASE_PATH + '/explore'}>
                        <Explorer />
                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

export default App;