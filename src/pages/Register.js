import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button } from 'semantic-ui-react';

import REGISTER_USER from '../graphql/mutations/registerUser';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

const Register = props => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) { // 'update' function will be trigered if the mutation is successfully executed. first parameter is 'proxy' but we don't need it, so we'll just put a '_' here. second parameter is 'result', but we can destrucuture 'data' from it, and from 'data' we are destrucuturing 'register' to which we give an alias of 'userData'.
      // console.log(result);
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      // console.log({ err });
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function registerUserCallback() {
    addUser();
  };

  const renderErrors = () => {
    if (Object.keys(errors).length > 0) {
      return (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>Register</Button>
      </Form>
      {renderErrors()}
    </div>
  );
};

export default Register;
