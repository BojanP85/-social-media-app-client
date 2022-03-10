import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Form, Message } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import CREATE_POST from "../graphql/mutations/createPost";
import FETCH_POSTS from "../graphql/queries/fetchPosts";

const PostForm = ({ createPostLoadingHandler }) => {
  const [error, setError] = useState("");

  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost] = useMutation(CREATE_POST, {
    variables: values,
    // 'optimisticResponse' for 'createPost' mutation doesn't work well with the 'Transition.Group' component.
    // it causes newly created Post to animate twice (inside 'Home' component).
    // this is why we use 'createPostLoadingHandler' solution instead.
    /* 
    optimisticResponse: {
      __typename: "Mutation",
      createPost: {
        id: Math.round(Math.random() * -1000000),
        __typename: "Post",
        body: values.body,
        createdAt: new Date().toISOString(),
        username: user.username,
        likeCount: 0,
        likes: [],
        commentCount: 0,
        comments: [],
      },
    }, 
    */
    update(cache, { data: { createPost } }) {
      const data = cache.readQuery({ query: FETCH_POSTS });
      cache.writeQuery({
        query: FETCH_POSTS,
        data: {
          ...data,
          getPosts: [createPost, ...data.getPosts],
        },
      });

      createPostLoadingHandler(false);
      values.body = "";
      setError("");
    },
    onError(err) {
      setError(err.graphQLErrors[0].message);
    },
  });

  function createPostCallback() {
    if (values.body.trim() === "") {
      setError("Post body must not be empty.");
      return;
    }

    createPostLoadingHandler(true);
    createPost();
  }

  return (
    <Form onSubmit={onSubmit} error>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World!"
          name="body"
          type="text"
          value={values.body}
          error={error ? true : false}
          onChange={onChange}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
        {error && (
          <Message error content={error} style={{ marginBottom: 20 }} />
        )}
      </Form.Field>
    </Form>
  );
};

export default PostForm;
