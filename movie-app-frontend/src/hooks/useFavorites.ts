import { useCallback, useEffect, useState } from "react";
import { Movie } from "../types";

const FAVORITES_KEY = "favorites";

const getFavoritesFromStorage = (): Movie[] => {
  try {
    const items = localStorage.getItem(FAVORITES_KEY);
    if (!items) return [];
    const parsedItems = JSON.parse(items);

    if (Array.isArray(parsedItems)) {
      return parsedItems as Movie[];
    }
    return [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);

    localStorage.removeItem(FAVORITES_KEY);
    return [];
  }
};

interface FavoritesHook {
  favorites: Movie[];
  isFavorite: (movie: Movie) => boolean;
  toggleFavorite: (movie: Movie) => void;
}

const useFavorites = (): FavoritesHook => {
  const [favorites, setFavorites] = useState<Movie[]>(getFavoritesFromStorage);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY) {
        setFavorites(getFavoritesFromStorage());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isFavorite = useCallback(
    (movie: Movie): boolean => {
      return favorites.some(
        (fav) => fav.Title === movie.Title && fav.Year === movie.Year
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (movie: Movie): void => {
      if (!movie || !movie.Title || !movie.Year) {
        console.warn(
          "Attempted to toggle favorite for invalid movie object:",
          movie
        );
        return;
      }

      setFavorites((prevFavorites) => {
        let updatedFavorites: Movie[];
        const movieIdentifier = { Title: movie.Title, Year: movie.Year };

        if (isFavorite(movie)) {
          updatedFavorites = prevFavorites.filter(
            (fav) =>
              !(
                fav.Title === movieIdentifier.Title &&
                fav.Year === movieIdentifier.Year
              )
          );
        } else {
          const favoriteToAdd: Movie = {
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster,
            imdbID: movie.imdbID,
          };
          updatedFavorites = [...prevFavorites, favoriteToAdd];
        }
        try {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
        } catch (error) {
          console.error("Error writing favorites to localStorage:", error);

          return prevFavorites;
        }
        return updatedFavorites;
      });
    },
    [isFavorite]
  );

  return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;
