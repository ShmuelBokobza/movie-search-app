import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AppHeader from "./components/AppBar";
import PrivateRoute from "./components/PrivateRoute";
import useAuth from "./hooks/useAuth";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppHeader />
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
            }
          />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
