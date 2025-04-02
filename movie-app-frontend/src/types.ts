// src/types.ts
export interface Movie {
  Title: string;
  Year: string; // Keep as string as per JSON data, parse if needed for comparison
  imdbID?: string; // Optional based on data inspection
  Type?: string; // Optional
  Poster: string; // Can be 'N/A'
  // Add any other fields you might use from the JSON
  // Example: Rated?: string; Released?: string; Runtime?: string; Genre?: string; Director?: string; etc.
}

export interface SearchParams {
  query?: string;
  sortBy?: "title" | "year" | ""; // Use union type for specific sort fields
  sortOrder?: "asc" | "desc";
}
