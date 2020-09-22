import React from 'react';

const Login = (props) => {

    const client_id = props.client_id;
    const redirect_uri = props.redirect_uri;
    const scope = 'user-top-read';

    let openSpotifyAuthorization = (props) => {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
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
