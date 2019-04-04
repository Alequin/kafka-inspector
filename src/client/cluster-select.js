import React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import gql from "graphql-tag";

const STORED_CLUSTERS_QUERY = gql`
  query storedClusters {
    storedClusters {
      id
      brokers
    }
  }
`;

const ClusterSelect = () => {
  return (
    <Query query={STORED_CLUSTERS_QUERY}>
      {({ loading, error, data }) => {
        console.log("TCL: ClusterSelect -> loading", loading);
        console.log("TCL: ClusterSelect -> error", error);
        console.log("TCL: ClusterSelect -> data", data);
        return null;
      }}
    </Query>
  );
};

const Cluster = ({ name, brokers }) => {
  return <section />;
};

export default ClusterSelect;
