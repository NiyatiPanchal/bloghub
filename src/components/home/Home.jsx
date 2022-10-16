import React from "react";
import Banner from "../banner/Banner";
import Catagories from "./Catagories";
import { Grid } from "@mui/material";
import Posts from "./post/Posts";

const Home = () => {
  return (
    <>
      <Banner />
      <Catagories />
      <Grid container item>
        <Posts />
      </Grid>
    </>
  );
};

export default Home;
