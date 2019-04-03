import React, { useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { createGlobalStyle } from "styled-components";

import AppContext from "./app-context";
import NavBar from "./nav-bar";
import ClusterSelect from "./cluster-select";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 2rem 0 0 0 ;
  }
`;

const client = new ApolloClient({
  uri: "/graphql"
});

const App = () => {
  const { currentCluster } = useContext(AppContext);

  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Router>
        <React.Fragment>
          <NavBar isClusterSelected={!!currentCluster} />
          <Route exact path="/" component={ClusterSelect} />
        </React.Fragment>
      </Router>
    </ApolloProvider>
  );
};

export default App;
