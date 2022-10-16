import React from "react";
import { AppBar, Toolbar, styled } from "@mui/material";
import { Link } from "react-router-dom";
const Component = styled(AppBar)`
  background: #306060;
`;

const Container = styled(Toolbar)`
  justify-content: center;
  & > a {
    padding: 20px;
    font-family: "Josefin Sans", sans-serif;
    font-size: 20px;
    color: #fff;
    text-decoration: none;
  }
`;

const Header = ({ user }) => {
  const handleLogout = () => {
    localStorage.clear();
  };
  return (
    <Component>
      <Container>
        <Link to="/">Home</Link>
        <Link to={`/profile/${user.username}`}>Profile</Link>
        <Link to="/login" onClick={() => handleLogout()}>
          Logout
        </Link>
      </Container>
    </Component>
  );
};

export default Header;
