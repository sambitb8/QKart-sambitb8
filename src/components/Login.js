import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import {Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const url = `${config.endpoint}/auth/login`;
  
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

   // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
   const validateInput = (data) => {
    if(!data.username) {
      enqueueSnackbar("Username is a required field", {variant: "warning", autoHideDuration: 2000});
      return false;
    }

    if(!data.password) {
      enqueueSnackbar("Password is a required field", {variant: "warning", autoHideDuration: 2000});
      return false;
    }

    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async () => {
    try {
      if(!validateInput(formData)) return;
      setFormData(prevData => ({
        ...prevData,
        loading: true
      }))
      const res = await axios.post(url, {
        username:formData.username,
        password:formData.password
      });
      setFormData({
        username: "",
        password: ""
      });
      res.status === 201 && enqueueSnackbar("Logged in successfully", {variant: "success", autoHideDuration: 2000})
      persistLogin(res.data.token, res.data.username, res.data.balance);
    } catch(err) {
      setFormData({
        username: "",
        password: "",
        confirmPassword: ""
      });
      err.response ? enqueueSnackbar(err.response.data.message, {variant: "error", autoHideDuration: 2000}) :
      enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON", {variant: "error", autoHideDuration: 2000})
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    minHeight="100vh"
  >
    <Header hasHiddenAuthButtons />
    <Box className="content">
      <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          title="Username"
          name="username"
          value={formData.username}
          placeholder="Enter Username"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          id="password"
          variant="outlined"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
        />
        {formData.loading ? 
           <Box sx={{ display: 'flex', justifyContent: "center" }}>
           <CircularProgress variant="indeterminate" size={24} />
           </Box>
           :
        <Button className="button" variant="contained" onClick={login}>
        LOGIN TO QKART
         </Button>
        }
        <p className="secondary-action">
        Don’t have an account? {" "}
           <Link className="link" to={"/register"}>
           Register now
           </Link>
        </p>
      </Stack>
    </Box>
    <Footer />
  </Box>
  );
};

export default Login;