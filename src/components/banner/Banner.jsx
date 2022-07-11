import { Box, styled, Typography } from "@mui/material";
import React from "react";

const Image = styled(Box)`
  background: url("/Images/background.png") center/100% repeat-x;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Heading = styled(Typography)`
  font-size: 80px;
  color: #306060;
  //   font-family: "Raleway", sans-serif;
  font-family: "Lora", serif;
  //   font-family: "Varela", sans-serif;
  //   font-family: "Varela Round", sans-serif;
  font-weight: bold;
`;

const Banner = () => {
  return (
    <Image>
      <Heading>BlogHub</Heading>
    </Image>
  );
};

export default Banner;
