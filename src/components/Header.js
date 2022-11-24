import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import { Avatar, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const history = useHistory();

  const clearLogin = () => {
    localStorage.clear();
    history.push("/login", {from: "/"});
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : localStorage.getItem("token") ? (
        <Stack
          mr={1}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
            </StyledBadge>
            <Typography
              ml={1}
              variant="overline"
              display="inline-block"
              gutterBottom
            >
              {localStorage.getItem("username")}
            </Typography>
          </Box>
          <Button size="large" variant="text" onClick={clearLogin}>
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Stack
          mr={1}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Button size="large" variant="text" onClick={() => history.push("/login", {from: "/"})}>
            LOGIN
          </Button>
          <Button size="large" variant="contained" onClick={() => history.push("/register", {from: "/"})}>
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
