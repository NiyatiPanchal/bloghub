import React from "react";
import Banner from "../banner/Banner";
import Catagories from "./Catagories";
import { Grid } from "@mui/material";
import Posts from "./post/Posts";

const Home = () => {
  return (
    <>
      <Banner />
      <Grid container>
        <Grid item lg={2} sm={2} xs={12}>
          <Catagories />
        </Grid>
        <Grid container item xs={12} sm={10} lg={10}>
          <Posts />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
