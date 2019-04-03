import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colours from "./variables/colours";

const ClusterSelect = () => {
  return (
    <NavBar>
      <Divider />
      <StyledLink to="/">Select a cluster</StyledLink>
      <Divider />
    </NavBar>
  );
};

const NavBar = styled.nav`
  display: flex;
  background-color: ${colours.cyan};
  padding: 1rem;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  margin: 0.5rem;
  color: ${colours.white};
`;

const Divider = styled.div`
  width: 0;
  border: 1px solid ${colours.white};
`;

export default ClusterSelect;
