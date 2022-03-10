import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import moment from "moment";

import FETCH_POST from "../graphql/queries/fetchPost";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import CommentForm from "../components/CommentForm";
import Spinner from "../components/Spinner";
import CommentCard from "../components/CommentCard";
import CustomPopup from "../util/CustomPopup";

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const postId = props.match.params.postId;

  const { loading, data } = useQuery(FETCH_POST, {
    variables: { postId },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  const renderPost = () => {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Image floated="left" as={Link} to="/">
              <Icon
                name="angle double left"
                circular={true}
                color="teal"
                size="big"
              />
            </Image>
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid className="single-post-page">
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <CustomPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() =>
                      user
                        ? commentInputRef.current.focus()
                        : props.history.push("/login")
                    }
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </CustomPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <CommentForm
                user={user}
                postId={postId}
                comments={comments}
                commentCount={commentCount}
                commentInputRef={commentInputRef}
              />
            )}
            <Header as="h2" className="comments-header">
              <Icon name="comments" color="blue" />
              <Header.Content>Comments</Header.Content>
            </Header>
            {comments.length === 0 && (
              <p className="no-comments">Be the first to comment</p>
            )}
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                comments={comments}
                commentCount={commentCount}
                user={user}
                postId={id}
              />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  if (loading && !data) return <Spinner>Loading post...</Spinner>;

  return renderPost();
};

export default SinglePost;
