import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import App from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getPosts: {
          merge(existing = [], incoming: any[]) {
            return incoming;
          },
        },
      },
    },
    Post: {
      fields: {
        likes: {
          merge(existing = [], incoming: any[]) {
            return incoming;
          },
        },
        comments: {
          merge(existing = [], incoming: any[]) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
