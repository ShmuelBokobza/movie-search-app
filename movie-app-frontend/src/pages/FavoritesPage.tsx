import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import MovieCard from "../components/MovieCard";
import useFavorites from "../hooks/useFavorites";
import { Movie } from "../types";

const FavoritesPage: React.FC = () => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't added any favorites yet.
          </Typography>
          <Typography color="text.secondary">
            Go to the Search page and click the heart icon on movies you like!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((movie: Movie) => (
            <Grid key={movie.imdbID || `${movie.Title}-${movie.Year}`}>
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie)}
                onToggleFavorite={toggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
