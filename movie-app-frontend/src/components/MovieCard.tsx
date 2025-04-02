import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { Movie } from "../types";

const ERROR_IMAGE = "https://via.placeholder.com/300x450.png?text=No+Poster";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!movie?.Title) {
    console.warn("Rendering empty card due to missing movie data:", movie);
    return null;
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = ERROR_IMAGE;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        alt={movie.Title}
        height="350"
        image={movie.Poster ? movie.Poster : ERROR_IMAGE}
        onError={handleImageError}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontSize: "1rem" }}
        >
          {movie.Title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.Year || "N/A"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ marginTop: "auto" }}>
        <Tooltip
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <IconButton
            aria-label="add to favorites"
            onClick={() => onToggleFavorite(movie)}
            color={isFavorite ? "error" : "default"}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
