import { MovieFilter } from "@mui/icons-material";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AppHeader: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <MovieFilter sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Movie App
          </Link>
        </Typography>
        {isAuthenticated && (
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Search
            </Button>
            <Button color="inherit" component={RouterLink} to="/favorites">
              Favorites
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}

        {!isAuthenticated && location.pathname !== "/login" && (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
