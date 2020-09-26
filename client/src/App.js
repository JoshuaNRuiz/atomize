import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker/Tracker'
import Login from './container/Login/Login'

import './App.css'

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [code, setCode] = useState(null);

  const hostname = 'http://' + window.location.hostname;
  const baseUrl = hostname.indexOf('localhost') != -1 ? hostname + ':8000' : hostname + '\/';

  const data = {
    code: code,
    redirect_uri: 'http://localhost:8000/'
  }

  const requestTokens = () => {
    const url = baseUrl + '/api/get-spotify-tokens';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then(data => {
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    })
    .catch(error => {
      alert(error);
    });
  };

  useEffect(() => {
    const parameters = window.location.search;
    const urlCode = new URLSearchParams(parameters).get('code');
    const codeIsInParameters = !!urlCode;

    if (!isLoggedIn && codeIsInParameters) {
      setCode(urlCode);
      setLoginStatus(true);
    } 

    if (isLoggedIn) {
      requestTokens();
    }
  }, [isLoggedIn, code]);

  let container = isLoggedIn ? <Tracker accessToken={accessToken} refreshToken={refreshToken}/> : <Login/>

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;