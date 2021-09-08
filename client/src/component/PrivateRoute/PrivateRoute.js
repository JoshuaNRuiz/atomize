import Cookies from '../../helpers/Cookies.js';
import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ ...rest }) => {

    const isLoggedIn = Cookies.isSet('access_token') && Cookies.isSet('refresh_token');
    const location = useLocation();
    const parameters = window.location.search;
    const code = new URLSearchParams(parameters).get('code');
    const codeIsInParameters = !!code;

    return (
        <Route {...rest}>
            {codeIsInParameters || isLoggedIn
                ? rest.children
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: location }
                }} />}
        </Route>
    )
}