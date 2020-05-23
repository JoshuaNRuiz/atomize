import React, {useState, useEffect} from 'react';
import Tracklist from './component/Tracklist/Tracklist.js'
import Login from './container/Login.js'

import './App.css';

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const baseUrl = 'https://accounts.spotify.com/authorize?'
  const clientId = 'client_id=8e6f4d6f92d645d1b22ca1f6a8e8f371';
  const response_type = 'response_type=token';
  const redirect_uri = 'redirect_uri=localhost:3000';
  const scope = 'scope=user-read-private';

  let openSpotifyAuthorization = () => {
    let url = `${baseUrl}${clientId}&${response_type}&${redirect_uri}&${scope}`
    window.open(url);
  };

  useEffect(() => {
    let parameters = window.location.hash.substring(1);
    let token = new URLSearchParams(parameters).get('access_token');
    setAccessToken(token);
    setLoginStatus(!!token);
  }, [isLoggedIn, accessToken]);

  let container = isLoggedIn ? <Tracklist accessToken={accessToken}/> : <Login authorize={openSpotifyAuthorization}/>

  return (
    <div className="App">
      {container} 
    </div>
  );
}

export default App;