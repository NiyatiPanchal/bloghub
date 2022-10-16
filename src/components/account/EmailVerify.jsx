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
const Text = styled(Typography)`
  color: #306060;
  text-align: center;
  font-size: 20px;
  // font-family: "Raleway", sans-serif;
  font-weight: bold;
`;

const verifyInitialValues = { email: "", otp: "" };

const EmailVerify = ({ setVerifyOTP, page, setForgotpassword }) => {
  const [flag, setFlag] = useState([]);
  const [verify, setVerify] = useState(verifyInitialValues);

  // Replacement of History hook
  const navigate = useNavigate();

  const verifyOTP = async () => {
    const { email, otp } = verify;
    // API call
    const response = await fetch("http://localhost:5000/api/auth/verify", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const json = await response.json();

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      setFlag(json.message);
      if (page === "login") {
        navigate("/");
      } else {
        setVerifyOTP(false);
      }
    } else {
      setFlag(json.message);
    }
  };

  const resendOTP = async () => {
    const { email } = verify;
    // API call
    const response = await fetch("http://localhost:5000/api/auth/resend-otp", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
      }),
    });

    const json = await response.json();

    if (json.success) {
      setFlag(json.message);
    } else {
      setFlag(json.error);
    }
  };

  const onInputChange = (e) => {
    setVerify({ ...verify, [e.target.name]: e.target.value });
  };

  const toggleLogin = () => {
    if (page === "reset") {
      setForgotpassword(false);
      setVerifyOTP(false);
    }
  };

  return (
    <Component>
      <Wrapper>
        <Text>Verify Your Email Address</Text>
        <InputFeild
          sx={{ color: "#306060" }}
          id="standard-basic"
          label="Enter Email"
          variant="standard"
          name="email"
          onChange={(e) => onInputChange(e)}
        />

        <InputFeild
          sx={{ color: "#306060" }}
          id="standard-basic"
          label="Enter OTP"
          variant="standard"
          name="otp"
          onChange={(e) => onInputChange(e)}
        />

        {flag !== "" ? <Error>{flag}</Error> : ""}
        <LoginButton variant="contained" onClick={() => verifyOTP()}>
          Verify
        </LoginButton>

        <SignupButton onClick={() => resendOTP()}>Resend OTP</SignupButton>
        <SignupButton onClick={() => toggleLogin()}>Back to Login</SignupButton>
      </Wrapper>
    </Component>
  );
};

export default EmailVerify;
