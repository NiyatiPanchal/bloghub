import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  styled,
  Typography,
  Input,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailVerify from "./EmailVerify";
import VerifyUser from "./VerifyUser";

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

const Forgot = styled(Button)`
  color: #306060;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
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
  color: red;
`;

const signUpInitialValues = {
  username: "",
  email: "",
  password: "",
  cpassword: "",
};
const loginInitialValues = { email: "", password: "" };

const Login = ({ setIsAuthenticated }) => {
  const [account, setAccount] = useState(false);
  const [signup, setSignup] = useState(signUpInitialValues);
  const [login, setLogin] = useState(loginInitialValues);
  const [flag, setFlag] = useState([]);
  const [show, setShow] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [forgotpassword, setForgotpassword] = useState(false);

  // Replacement of History hook
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignup = async () => {
    // API call
    const { username, email, password, cpassword } = signup;
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
        cpassword,
      }),
    });

    const json = await response.json();

    if (json.success) {
      setVerifyOTP(true);
      setFlag("Account created successfully");
      setAccount(true);
      setIsAuthenticated(true);
    } else {
      setFlag(json.error);
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

    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      setFlag("Logged in successfully");
      navigate("/");
      setIsAuthenticated(true);
    } else {
      setFlag(json.error);
    }
  };

  const forgotPassword = () => {
    setForgotpassword(true);
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
      {verifyOTP ? (
        <EmailVerify setVerifyOTP={setVerifyOTP} page="login" />
      ) : (
        <Box>
          {account ? (
            forgotpassword ? (
              <VerifyUser setForgotpassword={setForgotpassword} />
            ) : (
              <Wrapper>
                <Image src="/images/logo.png" alt="login" />
                <InputFeild
                  sx={{ color: "#306060" }}
                  id="standard-basic"
                  label="Enter Email"
                  variant="standard"
                  name="email"
                  onChange={(e) => onInputChange(e)}
                />

                <FormControl variant="standard">
                  <InputLabel
                    htmlFor="standard-adornment-password"
                    sx={{ color: "#306060" }}
                  >
                    Password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={show ? "text" : "password"}
                    name="password"
                    onChange={(e) => onInputChange(e)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {!show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {flag !== "" ? <Error>{flag}</Error> : ""}
                <Forgot onClick={() => forgotPassword()}>
                  Forgot Password?
                </Forgot>
                <LoginButton variant="contained" onClick={() => handleLogin()}>
                  Login
                </LoginButton>
                <Text>OR</Text>
                <SignupButton onClick={() => toggleAccount()}>
                  Create an Account
                </SignupButton>
              </Wrapper>
            )
          ) : (
            <Wrapper>
              <Image src="/images/logo.png" alt="login" />
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
              <FormControl variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={show ? "text" : "password"}
                  name="password"
                  onChange={(e) => onInputChange(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {!show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={show ? "text" : "password"}
                  name="cpassword"
                  onChange={(e) => onInputChange(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {!show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {flag && flag.length > 0
                ? flag.map((error) => <Error>{error.msg}</Error>)
                : ""}

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
      )}
    </Component>
  );
};

export default Login;
