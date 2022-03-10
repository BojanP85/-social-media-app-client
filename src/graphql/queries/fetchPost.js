import { gql } from "@apollo/client";

export default gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      createdAt

      likes {
        username
      }
      comments {
        id
        body
        username
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;
