import {
  Box,
  Typography,
  styled,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
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
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [category, setCategory] = useState("All");
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
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
      if (category === "All" || !category) {
        setPosts(json);
      } else {
        const newposts = json.filter(
          (newpost) => newpost.category === category
        );
        setPosts(newposts);
      }
    };

    fetchData();
  }, [category]);

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
      setUser(json);

      const sb = json.subscribers;
      await setSubscriberCount(sb.length);
    };

    getUsername();
  }, [subscriberCount]);

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <Container>
      <Details>
        <Typography>Name : {user.username}</Typography>
        <Typography>Email : {user.email}</Typography>
        <Typography>Subscribers : {subscriberCount}</Typography>
      </Details>
      <Typography>Your Posts</Typography>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>

        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          onChange={(e) => handleChange(e)}
          label="Category"
          name="category"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Movies">Movies</MenuItem>
          <MenuItem value="Sports">Sports</MenuItem>
          <MenuItem value="Tech">Tech</MenuItem>
          <MenuItem value="Fashion">Fashion</MenuItem>
        </Select>
      </FormControl>

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
