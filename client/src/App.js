import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker'
import Login from './container/Login.js'

import './App.css';

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const client_id = '8e6f4d6f92d645d1b22ca1f6a8e8f371';
  const redirect_uri = 'localhost:3000';
  const scope = 'user-top-read';

  let openSpotifyAuthorization = () => {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    window.open(url, "_blank");
  };

  useEffect(() => {
    let parameters = window.location.hash.substring(1);
    let token = new URLSearchParams(parameters).get('access_token');
    setAccessToken(token);
    setLoginStatus(!!token);
  }, [isLoggedIn, accessToken]);

  let container = isLoggedIn ? <Tracker accessToken={accessToken}/> : <Login authorize={openSpotifyAuthorization}/>

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;