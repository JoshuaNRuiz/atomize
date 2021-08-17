import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import axios from 'axios';
import Cookies from './helpers/Cookies';

import Navbar from './component/Navbar/Navbar';
import Login from './component/Login/Login';
import Gateway from './component/Gateway/Gateway';
import Analyzer from './container/Analyzer/Analyzer';
import Tracker from './container/Tracker/Tracker';
import Explorer from './container/Explorer/Explorer';
import Vibe from './container/Vibe/Vibe';

import './App.css'

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const BASE_PATH = process.env.REACT_APP_BASE_PATH;

    useEffect(handleLoginState, []);

    function handleLoginState() {
        if (!isLoggedIn) {
            const isAccessTokenValid = Cookies.isSet('access_token');
            const refreshToken = Cookies.get('refresh_token');
            if (isAccessTokenValid) {
                setLoginStatus(true);
            } else if (refreshToken) {
                renewAccessToken()
                    .then(() => setLoginStatus(true));
            } else {
                const parameters = window.location.search;
                const code = new URLSearchParams(parameters).get('code');
                const codeIsInParameters = !!code;

                if (codeIsInParameters) {
                    getTokens(code)
                        .then(() => setLoginStatus(true));
                }
            }
        }
    }

    async function getTokens(code) {
        const url = BASE_URL + `/api/spotify-helper/get-tokens?code=${code}`;
        await axios.get(url);
    }

    async function renewAccessToken(token) {
        const url = BASE_URL + '/api/spotify-helper/renew-access-token';
        await axios.get(url);
    }

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path={BASE_PATH + '/'}>
                        {isLoggedIn ? Gateway : Login }
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
                    <Route path={BASE_PATH + '/vibe'}>
                        <Vibe />
                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

export default App;