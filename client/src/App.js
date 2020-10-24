import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker/Tracker'
import Login from './container/Login/Login'

import './App.css'

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const requestTokens = async (code) => {
    const url = 'http://localhost:8000/api/spotify-helper/get-tokens';
    const data = {
      code: code,
      redirect_uri: 'http://localhost:8000/'
    }

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

  // managing users logged in state
  useEffect(() => {
    console.log("useEffect called");
    const localAccessToken = localStorage.getItem("accessToken");
    const localRefreshToken = localStorage.getItem("refreshToken");
    const localTokensArePresent = localAccessToken != null && localRefreshToken != null;
    console.log("lctap:" + localTokensArePresent);

    const localAccessTokenExpirationTime = localStorage.getItem('accessTokenExpirationTime')

    const userPreviouslyLoggedIn = localAccessTokenExpirationTime != null && localTokensArePresent;
    if (userPreviouslyLoggedIn) {
      console.log("previous");
      const currentTime = Date.now() / 1000; // we are checking in seconds
      const authExpired = currentTime > localAccessTokenExpirationTime;

      if (authExpired) {
        // use the refresh token
        console.log("auth expired");
      } else {
          if (!isLoggedIn) setLoginStatus(true);
          const statefulTokensArePresent = accessToken != null && refreshToken != null
          if (!statefulTokensArePresent) {
            setAccessToken(localAccessTokenExpirationTime);
            setRefreshToken(localRefreshToken);
          }
      }
    } else {
      const parameters = window.location.search;
      const code = new URLSearchParams(parameters).get('code');
      const codeIsInParameters = code != null;

      if (codeIsInParameters) {
        requestTokens(code).then(data => {
          console.log(code);
          console.log(data);
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
  }, [isLoggedIn]);

  let container = isLoggedIn ? <Tracker accessToken={accessToken} refreshToken={refreshToken}/> : <Login/>

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;