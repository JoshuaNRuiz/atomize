import React, {useState, useEffect} from 'react';
import Tracklist from './component/Tracklist/Tracklist.js'
import Login from './container/Login.js'

import './App.css';
import Track from './component/Tracklist/Track/Track.js';

function App() {
  const [isLoggedIn, setLoginStatus] = useState(false);

  if (!isLoggedIn) {

  }

  let authenticate = () => {
    let clientId = '8e6f4d6f92d645d1b22ca1f6a8e8f371';
    let uri = 'lvh.me:3000';
    let scope = 'user-read-private';
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=${scope}&response_type=token&redirect_uri=${uri}&show_dialog=false`
    window.location.replace(url);
  }

  let container = isLoggedIn ? <Tracklist /> : <Login authenticate={authenticate}/>

  return (
    <div className="App">
      {container} 
    </div>
  );
}

export default App;