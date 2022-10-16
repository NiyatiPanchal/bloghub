import {
  Box,
  Button,
  TextareaAutosize,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import Comment from "./Comment";

const Container = styled(Box)`
  margin-top: 100px;
  display: flex;
`;

const Image = styled("img")({
  width: 50,
  height: 50,
  borderRadius: "50%",
});

const StyledTextarea = styled(TextareaAutosize)`
  height: 100px;
  width: 100%;
  margin: 0 20px;
  border-radius: 10px;
`;

const StyledButton = styled(Button)`
  background: #306060;
  color: #fff;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-size: 18px;
  height: 40px;
  &:hover {
    color: #fff;
    background: #306060;
  }
`;

const Message = styled(Typography)`
  font-size: 14px;
  font-family: "Raleway", sans-serif;
  color: #878787;
  margin-top: 10px;
`;

const initialValues = {
  username: "",
  postId: "",
  comment: "",
};

const Comments = ({ post }) => {
  const [comments, setComments] = useState(initialValues);
  const [allComments, setAllComments] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState("");
  const url = "https://static.thenounproject.com/png/12017-200.png";

  useEffect(() => {
    const getUsername = async () => {
      // API call
      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      const json = await response.json();
      setUser(json.username);
      comments.username = json.username;
    };

    const getComments = async () => {
      // API call
      const response = await fetch(
        `http://localhost:5000/api/comments/fetchcomments/${post._id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const json = await response.json();
      setAllComments(json);
    };

    getUsername();
    getComments();
  }, [post, toggle]);

  const postComment = async () => {
    // API call
    const response = await fetch(
      "http://localhost:5000/api/comments/addcomment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },

        body: JSON.stringify({
          username: comments.username,
          postId: comments.postId,
          comment: comments.comment,
        }),
      }
    );

    const json = await response.json();
    if (json.success) {
      setToggle((prevState) => !prevState);
      setComments(initialValues);
    }
  };

  const handleChange = (e) => {
    setComments({ ...comments, postId: post._id, comment: e.target.value });
  };
  return (
    <Box>
      <Container>
        <Image src={url} alt="user-dp"></Image>
        <StyledTextarea
          minRows={5}
          name="comment"
          placeholder="Share your views..."
          value={comments.comment}
          onChange={(e) => handleChange(e)}
        />
        <StyledButton
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => postComment()}
        >
          Post
        </StyledButton>
      </Container>

      <Box>
        {allComments && allComments.length > 0 ? (
          allComments.map((allComment) => (
            <Comment comments={allComment} user={user} setToggle={setToggle} />
          ))
        ) : (
          <Message>No Comments Yet</Message>
        )}
      </Box>
    </Box>
  );
};

export default Comments;
