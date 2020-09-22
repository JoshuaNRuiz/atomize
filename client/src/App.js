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

  const requestToken = () => {
    fetch('/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        'client_id': client_id,
        'code': code,
        'redirect_uri': REDIRECT_URI
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Could not access the API.');
      }
    })
    .then(data => {
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    });
  };

  useEffect(() => {
    let parameters = window.location.search;
    let code = new URLSearchParams(parameters).get('code');

    if (!!code) {
      console.log(code);
      setCode(code);
      setLoginStatus(true)
    } else {
      console.log("weird");
      setAccessToken(null);
      setLoginStatus(false);
    }  

  }, [isLoggedIn, accessToken, code]);

  let container = isLoggedIn ? <Tracker code={code}/> : <Login redirect_uri={REDIRECT_URI} client_id={client_id}/>

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;