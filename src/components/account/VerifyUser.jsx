import { Box, TextField, Button, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  margin-top: 100px;
  box-shadow: 5px 2px 5px 2px #cad4d8;
  color: #306060;
`;

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

const verifyInitialValues = { email: "" };

const VerifyUser = ({ setForgotpassword }) => {
  const [flag, setFlag] = useState([]);
  const [verify, setVerify] = useState(verifyInitialValues);
  const [send, setSend] = useState(false);

  const sendOTP = async () => {
    const { email } = verify;
    // API call
    const response = await fetch(
      "http://localhost:5000/api/auth/forgetpassword",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
        }),
      }
    );

    const json = await response.json();

    if (json.success) {
      setFlag(json.message);
      setSend(true);
    } else {
      setFlag(json.message);
    }
  };

  const onInputChange = (e) => {
    setVerify({ ...verify, [e.target.name]: e.target.value });
  };

  const toggleLogin = () => {
    setForgotpassword(false);
  };

  return (
    <Component>
      {send ? (
        <ForgotPassword setForgotpassword={setForgotpassword}></ForgotPassword>
      ) : (
        <Wrapper>
          <InputFeild
            sx={{ color: "#306060" }}
            id="standard-basic"
            label="Enter Email"
            variant="standard"
            name="email"
            onChange={(e) => onInputChange(e)}
          />

          {flag !== "" ? <Error>{flag}</Error> : ""}
          <LoginButton variant="contained" onClick={() => sendOTP()}>
            Send OTP
          </LoginButton>

          <SignupButton onClick={() => toggleLogin()}>
            Back to Login
          </SignupButton>
        </Wrapper>
      )}
    </Component>
  );
};

export default VerifyUser;
