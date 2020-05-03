import React from "react";
import ReactDOM from "react-dom";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { Router, hashHistory, Route } from "react-router";

import App from "./components/App";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import requireAuth from "./components/requireAuth";

const networkInterface = createNetworkInterface({
  uri: "/graphql",
  opts: {
    // credentials tells us that the request is made to the browser which is in the same origin
    // in this case, used to tell that it is safe to send cookies along with the queries sent to the backend
    credentials: "same-origin",
  },
});

const client = new ApolloClient({
  dataIdFromObject: (o) => o.id,
  networkInterface,
});

const Root = () => (
  <ApolloProvider client={client}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="login" component={LoginForm} />
        <Route path="signup" component={SignupForm} />
        <Route path="dashboard" component={requireAuth(Dashboard)} />
      </Route>
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.querySelector("#root"));
