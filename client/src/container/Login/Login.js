import React from 'react';

const Login = () => {

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

    return (
        <div>
            <p>To view your information, you must temporarily authorize this application to
                access your Spotify information.</p>
            <button onClick={openSpotifyAuthorization}>Login</button>
        </div>
    )
}

export default Login;