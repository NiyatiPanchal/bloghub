import Login from "./components/account/Login";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import EmailVerify from "./components/account/EmailVerify";
import ForgotPassword from "./components/account/ForgotPassword";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import CreatePost from "./components/create/CreatePost";
import DetailView from "./components/details/DetailView";
import UpdatePost from "./components/create/UpdatePost";
import Profile from "./components/Profile";

const PrivateRoute = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getUsername();
  }, []);
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

    setUser(json);
  };
  return localStorage.getItem("token") === null ? (
    <Navigate replace to="/login" />
  ) : (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <>
      <div style={{ marginTop: 64 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/verify" element={<PrivateRoute />}>
            <Route path="/verify" element={<EmailVerify />} />
          </Route>
          <Route path="/forgotpassword" element={<PrivateRoute />}>
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Route>

          <Route path="/create" element={<PrivateRoute />}>
            <Route path="/create" element={<CreatePost />} />
          </Route>
          <Route path="/details/:id" element={<PrivateRoute />}>
            <Route path="/details/:id" element={<DetailView />} />
          </Route>
          <Route path="/update/:id" element={<PrivateRoute />}>
            <Route path="/update/:id" element={<UpdatePost />} />
          </Route>
          <Route path="/profile/:username" element={<PrivateRoute />}>
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
