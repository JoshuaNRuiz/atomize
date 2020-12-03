import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

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

  const requestTokens = async (code) => {
    const url = 'http://localhost:8000/api/spotify-helper/get-tokens';
    const data = {
      code: code,
      redirect_uri: 'http://localhost:8000/'
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : new Error(response.statusText))
    .catch(error => alert(error));
  }

  const renewAccessToken = async () => {
    const url = 'http://localhost:8000/api/spotify-helper/renew-access-token';
    const data = {
      refresh_token: refreshToken
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log('ERROR: ' + error);
    })
  }

  // managing users logged in state
  useEffect(() => {
    const localAccessToken = localStorage.getItem('accessToken');
    const localRefreshToken = localStorage.getItem('refreshToken');
    const localTokensArePresent = localAccessToken != null && localRefreshToken != null;
    const localAccessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime');
    const userPreviouslyLoggedIn = (localAccessTokenExpirationTime !== null && localTokensArePresent);

    if (userPreviouslyLoggedIn) {
      if (!isLoggedIn) {
        setLoginStatus(true);

        const statefulTokensArePresent = accessToken !== null && refreshToken !== null;

        if (!statefulTokensArePresent) {
          setAccessToken(localAccessToken);
          setRefreshToken(localRefreshToken);
        }
      }
    } else { // user has no history of logging in
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTokenExpirationTime');

      const parameters = window.location.search;
      const code = new URLSearchParams(parameters).get('code');
      const codeIsInParameters = code != null;

      if (codeIsInParameters && !isLoggedIn) {
        requestTokens(code).then(data => {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('refreshToken', data.refresh_token);
  
          const accessTokenExpirationTime = Math.floor((Date.now() / 1000) + 3600);
          localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
        })
        setLoginStatus(true);
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
          .then(data => {
            setAccessToken(data.access_token);
            const accessTokenExpirationTime = Math.floor((Date.now() / 1000) + 3600);
            localStorage.setItem('accessTokenExpirationTime', accessTokenExpirationTime);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  })

  let container = isLoggedIn ? Gateway : Login;
  const tracker = props => <Tracker {...props} accessToken={accessToken} refreshToken={refreshToken}/>

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? <Navbar /> : null}
        <Switch>
          <Route path='/' exact component={container} />
          <Route path='/analyze' render={Analyzer} />
          <Route path='/top' component={tracker} />
          <Route path='/explorer' component={Explorer} />
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;