import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const StyledTabled = styled(Table)`
  border: 1px solid #cad4d8;
  font-family: "Raleway", sans-serif;
`;

const StyledButton = styled(Button)`
  background: #306060;
  color: #fff;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 20px;
  margin: 20px;
  width: 85%;
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
  { id: 1, type: "Music" },
  { id: 2, type: "Movies" },
  { id: 3, type: "Sports" },
  { id: 4, type: "Tech" },
  { id: 5, type: "Fashion" },
];
const Catagories = () => {
  return (
    <>
      <Link to="/create" style={{ textDecoration: "none" }}>
        <StyledButton variant="contained">Create Blog</StyledButton>
      </Link>
      <StyledTabled>
        <TableHead>
          <TableRow>
            <TableCell>
              <StyledLink to="/?category=all">All Categories</StyledLink>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <StyledLink to={`/?category=${category.type}`}>
                  {category.type}
                </StyledLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTabled>
    </>
  );
};

export default Catagories;
