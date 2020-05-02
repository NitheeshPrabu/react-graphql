import "./style/style.css";

import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { Router, Route, hashHistory, IndexRoute } from "react-router";

import App from "./components/App";
import SongList from "./components/SongList";
import SongCreate from "./components/SongCreate";
import SongDetail from "./components/SongDetail";

// default config options in apollo client 1.x.x assumes graphql server is under `/graphql` endpoint.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
});

const Root = () => (
  <ApolloProvider client={client}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={SongList} />
        <Route path="songs" component={SongCreate} />
        <Route path="songs/:id" component={SongDetail} />
      </Route>
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.querySelector("#root"));
