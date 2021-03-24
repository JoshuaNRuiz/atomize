import React from 'react';

const Login = () => {
    const redirect_uri = process.env.REACT_APP_ENVIRONMENT + '/';
    const scope = 'user-top-read playlist-read-private user-library-read';

    function openSpotifyAuthorization() {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=' + '8e6f4d6f92d645d1b22ca1f6a8e8f371';
        url += '&scope=' + scope;
        url += '&redirect_uri=' + redirect_uri;
        window.open(url, "_self");
    };

    return (
        <div>
            <p>To view your information, you must temporarily authorize this application to
                access your Spotify information.</p>
            <button onClick={openSpotifyAuthorization}>Login</button>
        </div>
    )
}

export default Login;