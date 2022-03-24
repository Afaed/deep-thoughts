import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
  `;

  export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_FRIEND = gql `
mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
        _id
        username
        friendCount
        friendds {
            _id
            username
        }
    }
}`
//Recall that the ADD_USER mutation from this file was passed to the useMutation Hook in the Signup component. We'll do something similar in the Profile component.

//we don't need to decalre a query here as its implied.