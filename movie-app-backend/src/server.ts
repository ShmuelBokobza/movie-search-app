import axios from "axios";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Types definitions
interface Movie {
  Title?: string;
  Year?: string;
  [key: string]: any;
}

interface User {
  username: string;
  password: string;
}

interface JwtPayload {
  username: string;
}

interface AuthRequest extends Request {
  authData?: JwtPayload;
}

const app = express();
const PORT = process.env.PORT || 5001;
const GIST_URL =
  "https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON";

// --- Hardcoded Config ---
const HARDCODED_USER: User = {
  username: "admin",
  password: "1234",
};
const JWT_SECRET = "your_super_secret_key";
const TOKEN_EXPIRY = "1h";

// --- In-Memory Cache for Movie Data ---
let movieCache: Movie[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // Cache for 1 hour

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, JWT_SECRET, (err, authData) => {
      if (err) {
        console.error("JWT Verification Error:", err.message);
        res.sendStatus(403);
        return;
      }
      req.authData = authData as JwtPayload;
      next();
    });
  } else {
    console.log("Authorization header missing");
    res.sendStatus(401);
  }
};

// --- Helper Function to Fetch Movies ---
const fetchMovies = async (): Promise<Movie[]> => {
  const now = Date.now();
  if (movieCache && now - lastFetchTime < CACHE_DURATION) {
    console.log("Serving movies from cache");
    return movieCache;
  }

  console.log("Fetching movies from Gist...");
  try {
    const response = await axios.get<any>(GIST_URL);
    if (!Array.isArray(response.data)) {
      console.error("Fetched data is not an array:", response.data);
      throw new Error("Invalid data format received from Gist");
    }
    movieCache = response.data;
    lastFetchTime = now;
    console.log(`Fetched and cached ${movieCache.length} movies.`);
    return movieCache;
  } catch (error) {
    console.error(
      "Error fetching movie data:",
      error instanceof Error ? error.message : String(error)
    );

    if (movieCache) {
      console.warn("Returning potentially stale cache due to fetch error.");
      return movieCache;
    }
    throw error;
  }
};

// --- Routes ---

// 1. Login Route (Public)
app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log(`Login attempt: User='${username}'`);

  if (
    username === HARDCODED_USER.username &&
    password === HARDCODED_USER.password
  ) {
    // User authenticated, generate JWT
    const payload: JwtPayload = { username: HARDCODED_USER.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    console.log(`Login successful for '${username}', token generated.`);
    res.json({ token });
  } else {
    console.log(`Login failed for '${username}'.`);
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// 2. Movie Search Route
app.get(
  "/api/movies/search",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    const {
      query,
      sortBy,
      sortOrder = "asc",
    } = req.query as {
      query?: string;
      sortBy?: string;
      sortOrder?: string;
    };

    console.log(
      `Search request: query='${query}', sortBy='${sortBy}', sortOrder='${sortOrder}'`
    );

    try {
      const allMovies = await fetchMovies();

      // --- Filtering ---
      let filteredMovies = allMovies;
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filteredMovies = allMovies.filter(
          (movie) =>
            movie.Title && movie.Title.toLowerCase().includes(lowerCaseQuery)
        );
        console.log(
          `Found ${filteredMovies.length} movies matching query '${query}'.`
        );
      } else {
        console.log(
          "No query provided, returning all movies (before sorting)."
        );
      }

      // --- Sorting ---
      if (sortBy) {
        console.log(`Sorting by '${sortBy}' in '${sortOrder}' order.`);
        filteredMovies.sort((a, b) => {
          let valA: string | number;
          let valB: string | number;

          if (sortBy === "title") {
            valA = (a.Title || "").toLowerCase();
            valB = (b.Title || "").toLowerCase();
          } else if (sortBy === "year") {
            valA = parseInt(a.Year || "0", 10) || 0;
            valB = parseInt(b.Year || "0", 10) || 0;
          } else {
            return 0;
          }

          if (valA < valB) return sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      res.json(filteredMovies);
    } catch (error) {
      console.error(
        "Error during movie search:",
        error instanceof Error ? error.message : String(error)
      );
      res
        .status(500)
        .json({ message: "Error fetching or processing movie data" });
    }
  }
);

// --- Catch-all for basic testing ---
app.get("/", (_req: Request, res: Response) => {
  res.send("Movie App Backend is Running!");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  fetchMovies();
});
