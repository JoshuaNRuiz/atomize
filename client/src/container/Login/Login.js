import React from 'react';

const Login = (props) => {

    const client_id = props.client_id;
    const redirect_uri = window.location.href;
    const scope = 'user-top-read';

    const openSpotifyAuthorization = (props) => {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=' + '8e6f4d6f92d645d1b22ca1f6a8e8f371';
        url += '&scope=' + scope;
        url += '&redirect_uri=' + redirect_uri;
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