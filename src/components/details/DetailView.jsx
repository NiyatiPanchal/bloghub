import { Box, styled, Typography, Button } from "@mui/material";
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
  margin: 150px 0 50px 0;
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

const StyledButton = styled(Button)`
  background: #306060;
  // height: 25px;
  color: #fff;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 15px;
  margin: 0 20px 25px 20px;
  &:hover {
    color: #fff;
    background: #306060;
  }
`;

const DetailView = () => {
  const [post, setPost] = useState({});
  const [user, setUser] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const url = post.picture === "" ? "/Images/defaultImage.png" : post.picture;
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
      setPost(json.post);
      const sb = json.subscribers;
      await setSubscribers(sb);
    };

    fetchData();
  }, [id]);

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
      setIsSubscribe(subscribers.includes(json._id));
    };

    getUsername();
  }, [subscribers]);

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

  const subscribeUser = async () => {
    // API call
    const response = await fetch("http://localhost:5000/api/subscribe", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        auther: post.username,
      }),
    });

    const json = await response.json();
    if (json.success) {
      setIsSubscribe(true);
    }
  };

  const unSubscribeUser = async () => {
    const response = await fetch(
      "http://localhost:5000/api/subscribe/removesuscriber",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          author: post.username,
        }),
      }
    );

    const json = await response.json();
    if (json.success) {
      setSubscribers(json.subscribers);
      setIsSubscribe(false);
    }
  };

  return (
    <Container>
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
      <Image src={url} alt="" />
      <Box style={{ float: "right" }}>
        {user !== post.username &&
          (isSubscribe ? (
            <StyledButton variant="contained" onClick={unSubscribeUser}>
              Unsubscribe
            </StyledButton>
          ) : (
            <StyledButton variant="contained" onClick={subscribeUser}>
              Subscribe
            </StyledButton>
          ))}

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

      <Description>{post.description}</Description>

      <Comments post={post} />
    </Container>
  );
};

export default DetailView;
