## Prerequisites

- Node.js
- pnpm

## Setup and Running

1.  **Clone the Repository:**

    ```bash
    git clone [<your-repo-url>](https://github.com/ShmuelBokobza/movie-search-app.git)
    cd movie-search-app
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd movie-app-backend
    pnpm install
    ```

3.  **Install Frontend Dependencies:**

    ```bash
    cd ../movie-app-frontend
    pnpm install
    ```

4.  **Run the Backend Server:**

    - Navigate back to the `movie-app-backend` directory.
    - Open a terminal window.

    ```bash
    cd ../movie-app-backend
    nodemon server.js
    ```

    - The backend server will start on `http://localhost:5001`.

5.  **Run the Frontend Application:**

    - Navigate back to the `movie-app-frontend` directory.
    - Open a _separate_ terminal window.

    ```bash
    cd ../movie-app-frontend
    npm start
    ```

    - The React development server will start, usually on `http://localhost:5274`, and open the application in your default browser.

6.  **Login:**
    - Access the application (e.g., `http://localhost:5274`).
    - You will be prompted to log in.
    - Use the hardcoded credentials:
      - Username: `admin`
      - Password: `1234`

## Notes

- **Simplicity:** This project prioritizes simplicity as requested. Error handling is basic, and state management relies on local component state, custom hooks, and Local Storage.
- **Authentication:** The JWT secret is hardcoded (`your_super_secret_key`).The credentials are also hardcoded for demonstration purposes.
- **Data Source:** The app relies on an external Gist for data. The backend includes a simple in-memory cache to reduce repeated fetching.
- **Uniqueness:** Favorites are identified using the movie `Title` and `Year`. This might not be perfectly unique in a real-world scenario. Using an IMDb ID (if available in the data) would be more robust.
- **Scalability:** For larger applications, consider more robust state management (Context API with reducers, Redux, Zustand) and a proper database instead of Local Storage.
