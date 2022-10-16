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

const Image = styled("img")({
  width: 100,
  margin: "auto",
  display: "flex",
  padding: "50px 0 0",
});

const LoginButton = styled(Button)`
  background: #306060;
  height: 48px;
  border-radius: 2px;
  font-size: 18px;
  &:hover {
    background: #306060;
  }
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

const forgotPassInitialValues = {
  email: "",
  newpassword: "",
  cnewpassword: "",
};

const ForgotPassword = ({ setForgotpassword }) => {
  const [resetDetails, setResetDetails] = useState(forgotPassInitialValues);
  const [flag, setFlag] = useState("");
  const [show, setShow] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(true);
  const [userExist, setUserExist] = useState(true);

  // Replacement of History hook
  const navigate = useNavigate();

  const resetPassword = async () => {
    // API call
    const response = await fetch(
      "http://localhost:5000/api/auth/resetpassword",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: resetDetails.email,
          password: resetDetails.newpassword,
          cpassword: resetDetails.cnewpassword,
        }),
      }
    );

    const json = await response.json();
    if (!json.match) {
      setFlag(json.message);
    } else if (json.success) {
      setFlag(json.message);
      navigate("/");
      setForgotpassword(false);
    } else if (!json.success && !json.userexist) {
      setUserExist(false);
      setFlag(json.message);
    } else {
      setVerifyOTP(true);
      setFlag(json.error);
    }
  };

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onInputChange = (e) => {
    setResetDetails({ ...resetDetails, [e.target.name]: e.target.value });
  };

  const handletoggle = () => {
    setForgotpassword(false);
  };
  return (
    <>
      {verifyOTP ? (
        <EmailVerify
          setVerifyOTP={setVerifyOTP}
          page="reset"
          setForgotpassword={setForgotpassword}
        />
      ) : (
        <Wrapper>
          <Image src="/images/logo.png" alt="login" />
          <TextField
            id="standard-basic"
            label="Enter Email"
            variant="standard"
            name="email"
            onChange={(e) => onInputChange(e)}
          />
          <FormControl variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              New Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={show ? "text" : "password"}
              name="newpassword"
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
              Confirm New Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={show ? "text" : "password"}
              name="cnewpassword"
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

          <LoginButton variant="contained" onClick={() => resetPassword()}>
            Reset Password
          </LoginButton>
          {!userExist ? (
            <SignupButton onClick={() => handletoggle()}>
              Back to Login
            </SignupButton>
          ) : (
            ""
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ForgotPassword;
