import {
  Box,
  Button,
  FormControl,
  InputBase,
  styled,
  TextareaAutosize,
  MenuItem,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));
const Image = styled("img")({
  marginTop: "50px",
  width: "100%",
  height: "50vh",
  objectFit: "cover",
});

const StyledFormControl = styled(FormControl)`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`;

const InputTextField = styled(InputBase)`
  flex: 1;
  margin: 0 30px 0 0;
  font-size: 18px;
  font-family: "Raleway", sans-serif;
  border-radius: 10px;
  height: 50px;
`;

const TextArea = styled(TextareaAutosize)`
  width: 100%;
  margin-top: 50px;
  font-size: 18px;
  font-family: "Raleway", sans-serif;
  border-radius: 10px;
  &:focus-visible {
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  background: #306060;
  color: #fff;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 20px;
  margin: 0 20px 25px 20px;
  &:hover {
    color: #fff;
    background: #306060;
  }
`;

const AddImage = styled(Typography)`
  color: #000;
  text-transform: none;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  font-size: 15px;
  margin: 20px;
`;

const initialPost = {
  title: "",
  description: "",
  picture: "",
  username: "",
  category: "",
  createdDate: "",
};

const UpdatePost = () => {
  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState("");
  const url = post.picture === "" ? "/Images/defaultImage.png" : post.picture;

  const navigate = useNavigate();
  const { id } = useParams();

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
    fetchData();
  }, [id]);

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        // API Call
        const response = await fetch(
          "http://localhost:5000/api/posts/file/upload",
          {
            method: "POST",
            body: data,
            mode: "cors",
          }
        );
        const json = await response.json();

        post.picture = json.imageUrl;
      }
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

      post.username = json.username;
    };

    getImage();
    getUsername();
  }, [file, post]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const updatePost = async () => {
    // API call
    const response = await fetch(
      `http://localhost:5000/api/posts/updatepost/${id}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          picture: post.picture,
          username: post.username,
          category: post.category,
        }),
      }
    );

    const json = await response.json();

    if (json.success) {
      navigate(`/details/${id}`);
    }
  };
  return (
    <Container>
      <Image src={url} alt="default img" />
      <label htmlFor="fileInput" style={{ display: "flex" }}>
        <AddCircleIcon
          fontSize="large"
          color="action"
          style={{ marginTop: 10 }}
        />
        <AddImage>Add Image</AddImage>
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          onChange={(e) => handleChange(e)}
          label="Category"
          name="category"
          value={post.category}
        >
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Movies">Movies</MenuItem>
          <MenuItem value="Sports">Sports</MenuItem>
          <MenuItem value="Tech">Tech</MenuItem>
          <MenuItem value="Fashion">Fashion</MenuItem>
        </Select>
      </FormControl>
      <StyledFormControl>
        <InputTextField
          placeholder="Title"
          value={post.title}
          onChange={(e) => handleChange(e)}
          name="title"
        />
        <StyledButton variant="contained" onClick={() => updatePost()}>
          Update
        </StyledButton>
      </StyledFormControl>
      <TextArea
        minRows={5}
        placeholder="Tell Your Story..."
        name="description"
        value={post.description}
        onChange={(e) => handleChange(e)}
      />
    </Container>
  );
};

export default UpdatePost;
