import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Cookies from './helpers/Cookies';

import Navbar from './component/Navbar/Navbar';
import Footer from './component/Footer/Footer';
import Login from './component/Login/Login';
import Gateway from './component/Gateway/Gateway';
import Analyzer from './container/Analyzer/Analyzer';
import Tracker from './container/Tracker/Tracker';
import Explorer from './container/Explorer/Explorer';
import Vibe from './container/Vibe/Vibe';
import './App.css'

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);

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
                        .then(() => setLoginStatus(true))
                        .catch(error => alert(error));
                }
            }
        }
    }

    async function getTokens(code) {
        const url = '/api/spotify-helper/get-tokens';
        const options = {
            params: {
                'code': code
            },
            headers: {
                'Accept': 'application/json'
            }
        }
        await axios.get(url, options);
    }

    async function renewAccessToken() {
        const url = '/api/spotify-helper/renew-access-token';
        await axios.get(url);
    }

    return (
        <div className="App">
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path={'/'}>
                        {isLoggedIn ? Gateway : Login}
                    </Route>
                    <Route path={'/analyze'}>
                        <Analyzer />
                    </Route>
                    <Route path={'/top'}>
                        <Tracker />
                    </Route>
                    <Route path={'/explore'}>
                        <Explorer />
                    </Route>
                    <Route path={'/vibe'}>
                        <Vibe />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;