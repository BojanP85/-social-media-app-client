import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import CustomPopup from "../util/CustomPopup";

const PostCard = ({
  post: { id, body, createdAt, username, likeCount, likes, commentCount },
}) => {
  const { user } = useContext(AuthContext);

  const renderDeleteButton = () => {
    return user && user.username === username && <DeleteButton postId={id} />;
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image floated="right" as={Link} to={`/posts/${id}`}>
          <Icon
            name="envelope open outline"
            circular={true}
            color="teal"
            fitted={true}
          />
        </Image>
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Link to={user ? `/posts/${id}` : "/login"}>
          <CustomPopup content="Comment on post">
            <Button as="div" labelPosition="right">
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          </CustomPopup>
        </Link>
        {renderDeleteButton()}
      </Card.Content>
    </Card>
  );
};

export default memo(PostCard);
