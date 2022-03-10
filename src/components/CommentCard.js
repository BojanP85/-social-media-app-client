import React from "react";
import moment from "moment";
import { Card } from "semantic-ui-react";

import DeleteButton from "./DeleteButton";

const CommentCard = ({
  comment: { id, username, body, createdAt },
  comments,
  commentCount,
  user,
  postId,
}) => {
  return (
    <Card fluid className="single-post-page">
      <Card.Content>
        {user && user.username === username && (
          <DeleteButton
            postId={postId}
            commentId={id}
            comments={comments}
            commentCount={commentCount}
          />
        )}
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default CommentCard;
