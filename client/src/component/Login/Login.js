import React from 'react';

import './Login.css';

const Login = () => {
    const redirect_uri = '/';
    const scope = 'user-top-read playlist-read-private user-library-read';

    function openSpotifyAuthorization() {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=8e6f4d6f92d645d1b22ca1f6a8e8f371';
        url += `&scope=${scope}`;
        url += `&redirect_uri=${redirect_uri}`;
        window.open(url, "_self");
    };

    return (
        <div className='Login'>
            <h1>This app requires permission to access your Spotify information.</h1>
            <button className='Login__auth-button' onClick={openSpotifyAuthorization}>Authorize</button>
        </div>
    )
}

export default Login;