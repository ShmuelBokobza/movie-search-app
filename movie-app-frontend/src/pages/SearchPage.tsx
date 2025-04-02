import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import useFavorites from "../hooks/useFavorites";
import { searchMovies } from "../services/api";
import { Movie, SearchParams } from "../types";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<SearchParams["sortBy"]>("");
  const [sortOrder, setSortOrder] = useState<SearchParams["sortOrder"]>("asc");
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = useCallback(
    async (
      term: string = searchTerm,
      sort: SearchParams["sortBy"] = sortBy,
      order: SearchParams["sortOrder"] = sortOrder
    ) => {
      if (!term && !sort) {
        setMovies([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const params: SearchParams = {};
        if (term) params.query = term;
        if (sort) {
          params.sortBy = sort;
          params.sortOrder = order;
        }

        const response = await searchMovies(params);
        if (Array.isArray(response.data)) {
          setMovies(response.data);
          if (response.data.length === 0 && term) {
            setError(`No movies found matching "${term}".`);
          }
        } else {
          console.error("API did not return an array:", response.data);
          setMovies([]);
          setError("Received invalid data format from server.");
        }
      } catch (err: unknown) {
        console.error("Search error:", err);
        setError("Authentication error. Please log in again.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, sortBy, sortOrder]
  );

  useEffect(() => {
    if (movies.length > 0 || searchTerm) {
      handleSearch();
    }
  }, [sortBy, sortOrder]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSortByChange = (
    event: SelectChangeEvent<SearchParams["sortBy"]>
  ) => {
    setSortBy(event.target.value as SearchParams["sortBy"]);
  };

  const handleSortOrderChange = (
    event: SelectChangeEvent<SearchParams["sortOrder"]>
  ) => {
    setSortOrder(event.target.value as SearchParams["sortOrder"]);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Movies
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={() => handleSearch()}
          disabled={loading || !searchTerm}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select<SearchParams["sortBy"]>
            labelId="sort-by-label"
            value={sortBy}
            label="Sort By"
            onChange={handleSortByChange}
            disabled={loading}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 120 }}
          disabled={!sortBy || loading}
        >
          <InputLabel id="sort-order-label">Order</InputLabel>
          <Select<SearchParams["sortOrder"]>
            labelId="sort-order-label"
            value={sortOrder}
            label="Order"
            onChange={handleSortOrderChange}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {error && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && movies.length > 0 && (
        <Grid container spacing={3}>
          {movies.map((movie) => (
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
      {!loading && movies.length === 0 && !error && searchTerm && (
        <Typography sx={{ mt: 3, textAlign: "center" }}>
          No results found for "{searchTerm}". Try a different search.
        </Typography>
      )}
      {!loading && movies.length === 0 && !error && !searchTerm && !sortBy && (
        <Typography
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Enter a search term or select a sort option to begin.
        </Typography>
      )}
    </Container>
  );
};

export default SearchPage;
