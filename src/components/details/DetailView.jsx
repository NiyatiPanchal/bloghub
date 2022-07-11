import { Box, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Comments from "./comments/Comments";

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));

const Image = styled("img")({
  width: "100%",
  height: "50vh",
  objectFit: "cover",
});

const Heading = styled(Typography)`
  font-size: 38px;
  font-weight: 600;
  text-align: center;
  margin: 50px 0 100px 0;
  word-break: break-word;
  font-family: "Raleway", sans-serif;
  color: #000000;
`;

const EditIcon = styled(Edit)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
  cursor: pointer;
`;

const Author = styled(Box)`
  color: #878787;
  margin: 20px 0;
  display: flex;
  & > p {
    font-family: "Raleway", sans-serif;
  }
`;

const Description = styled(Typography)`
  word-break: break-word;
  font-family: "Raleway", sans-serif;
  color: #000000;
`;

const DetailView = () => {
  const [post, setPost] = useState({});
  const [user, setUser] = useState("");
  const url =
    post.picture === ""
      ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80"
      : post.picture;
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/posts/post/${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();
      setPost(json);
    };

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
    };
    fetchData();
    getUsername();
  }, []);

  const deletePost = async () => {
    // API call
    const response = await fetch(
      `http://localhost:5000/api/posts/deletepost/${id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },

        body: JSON.stringify(),
      }
    );
    const json = await response.json();

    if (json.success) {
      navigate("/");
    }
  };
  return (
    <Container>
      <Image src={url} alt="" />
      <Box style={{ float: "right" }}>
        {user === post.username && (
          <>
            <Link to={`/update/${post._id}`}>
              <EditIcon color="primary" />
            </Link>
            <DeleteIcon color="error" onClick={() => deletePost()} />
          </>
        )}
      </Box>
      <Heading>{post.title}</Heading>
      <Author>
        <Typography>
          Author :&nbsp;
          <Box component="span" style={{ fontWeight: 600 }}>
            {post.username}
          </Box>
        </Typography>
        <Typography style={{ marginLeft: "auto" }}>
          {new Date(post.createdDate).toDateString()}
        </Typography>
      </Author>
      <Description>{post.description}</Description>

      <Comments post={post} />
    </Container>
  );
};

export default DetailView;
