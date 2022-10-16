import { Box, styled, Typography } from "@mui/material";
import React from "react";

const Container = styled(Box)`
  border: 1px solid #d3cede;
  border-radius: 10px;
  margin: 10px;
  height: 350px;
  display: flex;
  align-items: center;
  flex-direction: column;
  & > p {
    padding: 0 5px 5px 5px;
    font-family: "Raleway", sans-serif;
  }
`;

const Image = styled("img")({
  width: "100%",
  borderRadius: "10px 10px 0 0",
  objectFit: "cover",
  height: "150px",
});

const Text = styled(Typography)`
  color: #878787;
  font-size: 12px;
`;

const Heading = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

const Details = styled(Typography)`
  font-size: 14px;
  font-weight: bold;
  word-break: break-word;
`;
const Post = ({ post, id }) => {
  const url = post.picture ? post.picture : "/Images/defaultImage.png";
  const addElipsis = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };
  return (
    <Container>
      <Image src={url} alt="blog" />
      <Text>{post.category}</Text>
      <Heading>{addElipsis(post.title, 20)}</Heading>
      <Text> Written by {post.username}</Text>
      <Details>{addElipsis(post.description, 150)}</Details>
    </Container>
  );
};

export default Post;
