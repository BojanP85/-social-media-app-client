import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Grid,
  Transition,
  Dimmer,
  Loader,
  Image,
  Card,
  Segment,
} from "semantic-ui-react";

import FETCH_POSTS from "../graphql/queries/fetchPosts";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import Spinner from "../components/Spinner";
import LoadingSkeleton from "../assets/skeleton.png";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS);
  const [isNewPostLoading, setIsNewPostLoading] = useState(false);

  const createPostLoadingHandler = (data) => {
    setIsNewPostLoading(data);
  };

  const renderPosts = () => {
    const { getPosts: posts } = data; // destructuring 'getPosts' from 'data' and then giving it an alias of 'posts'.

    return (
      <Transition.Group>
        {isNewPostLoading && (
          <Grid.Column style={{ marginBottom: 20 }}>
            <Card fluid className="loading-card">
              <Card.Content>
                <Dimmer active inverted>
                  <Loader size="large" />
                </Dimmer>
                <Image src={LoadingSkeleton} className="loading-img" />
              </Card.Content>
            </Card>
          </Grid.Column>
        )}
        {posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <Transition transitionOnMount={true}>
                <Segment className="card-segment">
                  <PostCard post={post} />
                </Segment>
              </Transition>
            </Grid.Column>
          ))}
      </Transition.Group>
    );
  };

  const renderPostForm = () => {
    return (
      user && (
        <Grid.Column>
          <PostForm createPostLoadingHandler={createPostLoadingHandler} />
        </Grid.Column>
      )
    );
  };

  if (loading && !data) return <Spinner>Loading posts...</Spinner>;

  return (
    <Grid columns={3} container doubling stackable>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {renderPostForm()}
        {renderPosts()}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
