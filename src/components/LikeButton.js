import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";

import LIKE_POST from "../graphql/mutations/likePost";
import CustomPopup from "../util/CustomPopup";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST, {
    variables: { postId: id },
    optimisticResponse: {
      __typename: "Mutation",
      likePost: {
        __typename: "Post",
        id: id,
        likes:
          user &&
          (liked
            ? likes.filter((like) => like.username !== user.username)
            : [
                ...likes,
                {
                  __typename: "Like",
                  id: Math.round(Math.random() * -1000000),
                  username: user.username,
                },
              ]),
        likeCount: liked ? likeCount - 1 : likeCount + 1,
      },
    },
  });

  const likeButton = user ? (
    <Button color="teal" basic={liked ? false : true}>
      <Icon name="heart" />
    </Button>
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <CustomPopup content={liked ? "Unlike" : "Like"}>
      <Button
        as="div"
        labelPosition="right"
        onClick={user ? likePost : undefined}
      >
        {likeButton}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </CustomPopup>
  );
};

export default LikeButton;
