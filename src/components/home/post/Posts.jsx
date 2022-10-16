import React, { useEffect, useState } from "react";
import { Box, Grid, styled } from "@mui/material";
import Post from "./Post";
import { useSearchParams, Link } from "react-router-dom";

const EmptyBox = styled(Box)`
  font-family: "Raleway", sans-serif;
  color: inherit;
  font-weight: 600;
  margin: 30px 80px;
  font-size: 18px;
`;

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const [serchParams] = useSearchParams();
  const category = serchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all posts
      const response = await fetch(
        "http://localhost:5000/api/posts/fetchallposts",
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
  return (
    <>
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
    </>
  );
};

export default Posts;
