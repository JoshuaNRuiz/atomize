import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker/Tracker'
import Login from './container/Login/Login'

import './App.css'

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [code, setCode] = useState(null);

  const client_id = '8e6f4d6f92d645d1b22ca1f6a8e8f371';
  const REDIRECT_URI = 'http://localhost:8000/';

  const requestTokens = () => {
    const url = REDIRECT_URI + 'api/get-spotify-tokens';
    const data = {
      'client_id': client_id,
      'code': code,
      'redirect_uri': REDIRECT_URI
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Could not access the API.');
      }
    })
    .then(data => {
      console.log(data.access_token);
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
  }, [isLoggedIn, code]); // rerun effect if any of these change

  let container = isLoggedIn ? <Tracker code={code}/> : <Login redirect_uri={REDIRECT_URI} client_id={client_id}/>

  return (
    <div className="App">
      {container}
      <button onClick={requestTokens}>REQUEST</button>
    </div>
  );
}

export default App;