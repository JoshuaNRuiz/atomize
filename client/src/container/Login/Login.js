import React from 'react';

const Login = (props) => {

    const client_id = props.client_id;
    const redirect_uri = props.redirect_uri;
    const scope = 'user-top-read';

    let openSpotifyAuthorization = (props) => {
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=' + client_id;
        url += '&scope=' + scope;
        url += '&redirect_uri=' + redirect_uri;
        console.log(url);
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


//
//
// curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://accounts.spotify.com/authorize?response_type=code&client_id=8e6f4d6f92d645d1b22ca1f6a8e8f371&scope=user-top-read&redirect_uri=localhost:8000
// https://accounts.spotify.com/authorize?response_type=code&client_id=8e6f4d6f92d645d1b22ca1f6a8e8f371&scope=user-top-read&redirect_uri=localhost%3A8000