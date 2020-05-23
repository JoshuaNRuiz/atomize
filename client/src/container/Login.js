import React from 'react';

const Login = (props) => {
    return (
        <div>
            <p>To view your information, you must temporarily authorize this application to access your Spotify information.</p>
            <button onClick={props.authorize}>Login</button>
        </div>
    )
}

export default Login;