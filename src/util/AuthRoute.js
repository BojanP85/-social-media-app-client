import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

const AuthRoute = ({ component: Component, ...rest }) => {
  // console.log(rest); // with 'rest' operator we are passing remaining atributes, such as 'exact' and 'path'.
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => user ? <Redirect to="/" /> : <Component {...props} /> }
    />
  );
};

export default AuthRoute;
