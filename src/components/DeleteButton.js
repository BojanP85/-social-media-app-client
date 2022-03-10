import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import DELETE_POST from "../graphql/mutations/deletePost";
import DELETE_COMMENT from "../graphql/mutations/deleteComment";
import FETCH_POSTS from "../graphql/queries/fetchPosts";
import CustomPopup from "../util/CustomPopup";

const DeleteButton = ({
  postId,
  commentId,
  comments,
  commentCount,
  callback,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // if we have a 'commentId' that means the 'DeleteButton' is on a comment and not on a post.
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const optimisticResponse = commentId
    ? {
        __typename: "Mutation",
        deleteComment: {
          __typename: "Post",
          id: postId,
          comments: comments.filter((comment) => comment.id !== commentId),
          commentCount: commentCount - 1,
        },
      }
    : {
        __typename: "Mutation",
        deletePost: {
          __typename: "Post",
          id: postId,
        },
      };

  const confirmHandler = () => {
    setConfirmOpen(false);
    deletePostOrComment();
  };

  const [deletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },
    optimisticResponse,
    update(cache) {
      if (!commentId) {
        // removing post from cache so the change is reflected on the frontend without us having to fetch the posts again.
        const data = cache.readQuery({ query: FETCH_POSTS });
        cache.writeQuery({
          query: FETCH_POSTS,
          data: {
            ...data,
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        });
      }

      if (callback) callback();
    },
  });

  return (
    <>
      <CustomPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </CustomPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmHandler}
      />
    </>
  );
};

export default DeleteButton;
