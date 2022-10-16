import { Box, styled, Typography } from "@mui/material";
import React from "react";

const Logo = styled(Box)`
  width: 100%;
  height: 25vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Heading = styled(Typography)`
  font-size: 60px;
  color: #306060;
  // font-family: "Raleway", sans-serif;
  // font-family: "Lora", serif;
  // font-family: "Varela", sans-serif;
  font-family: "Varela Round", sans-serif;
  font-weight: bold;
`;

const Banner = () => {
  return (
    <Logo>
      <Heading>BlogHub</Heading>
    </Logo>
  );
};

export default Banner;
