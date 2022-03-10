import { gql } from "@apollo/client";

// we don't need to return anything from DELETE mutation. we just need to make sure that it runs successfully, so we can just leave it like this.
export default gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
