import React, {useState, useEffect} from 'react';
import Tracker from './container/Tracker'
import Login from './container/Login.js'

import './App.css'

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    let parameters = window.location.hash.substring(1);
    let token = new URLSearchParams(parameters).get('access_token');
    setAccessToken(token);
    setLoginStatus(!!token);
  }, [isLoggedIn, accessToken]);

  let container = isLoggedIn ? <Tracker accessToken={accessToken}/> : <Login />

  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;