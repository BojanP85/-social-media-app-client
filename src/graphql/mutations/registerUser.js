import { gql } from '@apollo/client';

export default gql`
  mutation Register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, confirmPassword: $confirmPassword }) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
