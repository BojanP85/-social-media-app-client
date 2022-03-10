import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Card, Form } from "semantic-ui-react";

import CREATE_COMMENT from "../graphql/mutations/createComment";

const CommentForm = ({
  postId,
  user,
  comments,
  commentCount,
  commentInputRef,
}) => {
  const [comment, setComment] = useState("");

  const [createComment] = useMutation(CREATE_COMMENT, {
    variables: {
      postId,
      body: comment,
    },
    optimisticResponse: {
      __typename: "Mutation",
      createComment: {
        __typename: "Post",
        id: postId,
        comments: [
          {
            __typename: "Comment",
            id: Math.round(Math.random() * -1000000),
            body: comment,
            username: user.username,
            createdAt: new Date().toISOString(),
          },
          ...comments,
        ],
        commentCount: commentCount + 1,
      },
    },
    update() {
      setComment("");
      commentInputRef.current.blur(); // this is going to blur the input once the user submits the comment.
    },
  });

  return (
    <Card fluid className="single-post-page">
      <Card.Content>
        <p>Post a comment</p>
        <Form>
          <div className="ui action input fluid">
            <input
              type="text"
              placeholder="Comment"
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              ref={commentInputRef}
            />
            <button
              type="submit"
              className="ui button teal"
              disabled={comment.trim() === ""}
              onClick={createComment}
            >
              Submit
            </button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default CommentForm;
