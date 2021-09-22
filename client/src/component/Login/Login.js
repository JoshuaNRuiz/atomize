import React from 'react';
import './Login.css';

import SpotifyLogo from '../../resources/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png';
const Login = () => {
    const redirect_uri = 'http://localhost:3000/'
    const scope = 'user-top-read playlist-read-private user-library-read';

    function openSpotifyAuthorization() {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=8e6f4d6f92d645d1b22ca1f6a8e8f371';
        url += `&scope=${scope}`;
        url += `&redirect_uri=${redirect_uri}`;
        window.open(url, '_self');
    };

    return (
        <div className='Login'>
            <div className='Login__AuthorizeContainer'>
                <span className="Login__Logo">atomize</span>
                <span className='Login__Text'>
                    This app requires permission to access your Spotify information.
                </span>
                <button className='Login__AuthButton' onClick={openSpotifyAuthorization}>Authorize</button>
            </div>
            <img className='Login__SpotifyLogo' src={SpotifyLogo}></img>
        </div>
    )
}

export default Login;