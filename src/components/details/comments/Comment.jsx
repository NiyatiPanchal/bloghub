import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Delete } from "@mui/icons-material";
import React from "react";

const Component = styled(Box)`
  margin-top: 30px;
  background: #f6f6f6;
  padding: 10px;
  border-radius: 10px;
`;

const Container = styled(Box)`
  display: flex;
  margin-bottom: 5px;
  & > p {
    word-break: break-word;
    font-family: "Raleway", sans-serif;
  }
`;

const Name = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
`;

const StyledDate = styled(Typography)`
  color: #878787;
  font-size: 14px;
`;

const DeleteIcon = styled(Delete)`
  margin-left: auto;
  cursor: pointer;
`;

const StyledComment = styled(Typography)`
  word-break: break-word;
  font-family: "Raleway", sans-serif;
  color: #00000;
  font-size: 15px;
`;

const Comment = ({ comments, user, setToggle }) => {
  const removeComment = async () => {
    // API call
    const response = await fetch(
      `http://localhost:5000/api/comments/deletecomment/${comments._id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setToggle((prevState) => !prevState);
    }
  };
  return (
    <Component>
      <Container>
        <Name>{comments.username}</Name>
        <StyledDate>{new Date(comments.date).toDateString()}</StyledDate>
        {comments.username === user && (
          <DeleteIcon onClick={() => removeComment()} />
        )}
      </Container>
      <Box>
        <StyledComment>{comments.comment}</StyledComment>
      </Box>
    </Component>
  );
};

export default Comment;
