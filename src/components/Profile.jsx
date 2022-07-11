import { Box, Typography, styled, Grid } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import Post from "./home/post/Post";
import { useParams, Link } from "react-router-dom";

const Container = styled(Box)`
  margin: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  & > p {
    padding: 15px;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 30px;
    text-decoration: underline;
  }
`;

const Details = styled(Box)`
  padding: 50px;
  & > p {
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 20px;
  }
`;

const EmptyBox = styled(Box)`
  font-family: "Raleway", sans-serif;
  color: inherit;
  font-weight: 600;
  margin: 30px 80px;
  font-size: 18px;
`;

const Profile = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    getUsername();
    fetchData();
  }, []);

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
    console.log(json);
    setUser(json);
  };

  const fetchData = async () => {
    console.log(user.username);
    // Fetch all posts
    const response = await fetch(
      `http://localhost:5000/api/posts/fetchallposts/${username}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    setPosts(json);
  };

  return (
    <Container>
      <Details>
        <Typography>Name : {user.username}</Typography>
        <Typography>Email : {user.email}</Typography>
      </Details>
      <Typography>Your Posts</Typography>

      <Grid container item>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Grid item lg={3} sm={4} xs={12} key={post._id}>
              <Link
                to={`/details/${post._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Post post={post} key={post._id} id={post._id} />
              </Link>
            </Grid>
          ))
        ) : (
          <EmptyBox>No data available to display</EmptyBox>
        )}
      </Grid>
    </Container>
  );
};

export default Profile;
