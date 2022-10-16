import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  styled,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";

const StyledButton = styled(Button)`
  background: #306060;
  color: #fff;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 20px;
  margin: 20px;
  // width: 10%;
  &:hover {
    color: #fff;
    background: #306060;
  }
`;

const StyledLink = styled(Link)`
  font-family: "Raleway", sans-serif;
  text-decoration: none;
  color: inherit;
  font-weight: bold;
`;

const categories = [
  { id: 1, type: "All" },
  { id: 2, type: "Music" },
  { id: 3, type: "Movies" },
  { id: 4, type: "Sports" },
  { id: 5, type: "Tech" },
  { id: 6, type: "Fashion" },
];
const Catagories = () => {
  return (
    <>
      <Grid container spacing={0} direction="row" justifyContent="center">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Category
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Category"
            name="category"
          >
            {categories.map((category) => (
              <MenuItem value={category}>
                <StyledLink to={`/?category=${category.type}`}>
                  {category.type}
                </StyledLink>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Link to="/create" style={{ textDecoration: "none" }}>
          <StyledButton variant="contained">Create Blog</StyledButton>
        </Link>
      </Grid>
    </>
  );
};

export default Catagories;
