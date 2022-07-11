import { Box, TextField, Button, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  margin-top: 100px;
  box-shadow: 5px 2px 5px 2px #cad4d8;
  color: #306060;
`;

const Image = styled("img")({
  width: 100,
  margin: "auto",
  display: "flex",
  padding: "50px 0 0",
});

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div,
  & > button,
  & > p {
    margin-top: 20px;
    text-transform: none;
  }
`;

const InputFeild = styled(TextField)`
  &:focus {
    color: #306060;
  }
`;

const LoginButton = styled(Button)`
  background: #306060;
  height: 48px;
  border-radius: 2px;
  font-size: 18px;
  &:hover {
    background: #306060;
  }
`;

const Text = styled(Typography)`
  color: #306060;
  text-align: center;
  font-size: 14px;
`;

const SignupButton = styled(Button)`
  background: #fff;
  height: 48px;
  border-radius: 2px;
  color: #306060;
  box-shadow: 0 2px 4px 0 #82afb0;
  font-size: 18px;
`;

const Error = styled(Typography)`
  font-size: 10px;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;

const signUpInitialValues = { username: "", email: "", password: "" };
const loginInitialValues = { email: "", password: "" };

const Login = ({ setIsAuthenticated }) => {
  const [account, setAccount] = useState(false);
  const [signup, setSignup] = useState(signUpInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [flag, setFlag] = useState("");

  // Replacement of History hook
  const navigate = useNavigate();

  const handleSignup = async () => {
    // API call
    const { username, email, password } = signup;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const json = await response.json();

    if (json.success) {
      //   // save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/");
      // showAlert("Account created successfully", "success");
      setFlag("Account created successfully");
      setAccount(true);
      setIsAuthenticated(true);
    } else {
      // showAlert("Invalid Details", "danger");
      setFlag("Invalid Details");
    }
  };

  const handleLogin = async () => {
    // API call
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: login.email,
        password: login.password,
      }),
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      setFlag("Logged in successfully");
      // showAlert("Logged in successfully", "success");
      navigate("/");
      setIsAuthenticated(true);
    } else {
      // showAlert("Invalid Credentials", "danger");
      setFlag("Invalid Credentials");
    }
  };

  const toggleAccount = () => {
    account ? setAccount(false) : setAccount(true);
    setFlag("");
  };

  const onInputChange = (e) => {
    account
      ? setLogin({ ...login, [e.target.name]: e.target.value })
      : setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  return (
    <Component>
      <Box>
        <Image src="/images/logo.png" alt="login" />
        {account ? (
          <Wrapper>
            <InputFeild
              id="standard-basic"
              label="Enter Email"
              variant="standard"
              name="email"
              onChange={(e) => onInputChange(e)}
            />
            <InputFeild
              id="standard-basic"
              label="Enter password"
              variant="standard"
              name="password"
              onChange={(e) => onInputChange(e)}
            />
            {flag !== "" ? <Error>{flag}</Error> : ""}
            <LoginButton variant="contained" onClick={() => handleLogin()}>
              Login
            </LoginButton>
            <Text>OR</Text>
            <SignupButton onClick={() => toggleAccount()}>
              Create an Account
            </SignupButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              id="standard-basic"
              label="Enter Username"
              variant="standard"
              name="username"
              onChange={(e) => onInputChange(e)}
            />
            <TextField
              id="standard-basic"
              label="Enter Email"
              variant="standard"
              name="email"
              onChange={(e) => onInputChange(e)}
            />
            <TextField
              id="standard-basic"
              label="Enter Password"
              variant="standard"
              name="password"
              onChange={(e) => onInputChange(e)}
            />
            {flag !== "" ? <Error>{flag}</Error> : ""}
            <LoginButton variant="contained" onClick={() => handleSignup()}>
              Sign Up
            </LoginButton>
            <Text>OR</Text>
            <SignupButton onClick={() => toggleAccount()}>
              Already have an account
            </SignupButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
