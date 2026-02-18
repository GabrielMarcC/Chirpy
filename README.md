# Chirpy - Project for Learning Backend Development

This project is a Twitter clone called "Chirpy", developed as a practical exercise to learn backend concepts using **Node.js**, **Express**, and **PostgreSQL**. The goal is to build a robust API that manages users, "chirps" (messages), and authentication.

## API Endpoints

Below is a brief description of the available endpoints in the application.

### Health Check

- **`GET /api/healthz`**: Checks the health of the service. Returns 200 OK if the server is running.

### Users

- **`POST /api/users`**: Creates a new user. Expects `email` and `password` in the body.
- **`PUT /api/users`**: Updates an existing user (email/password). Requires authentication (JWT).

### Authentication

- **`POST /api/login`**: Authenticates a user. Returns an access token (JWT) and a refresh token.
- **`POST /api/refresh`**: Refreshes the access token using a valid refresh token.
- **`POST /api/revoke`**: Revokes a refresh token, logging the user out.

### Chirps (Messages)

- **`GET /api/chirps`**: Retrieves all chirps. Supports query parameters for filtering by `author_id` and sorting (`sort`).
- **`GET /api/chirps/:chirpId`**: Retrieves a specific chirp by its ID.
- **`POST /api/chirps`**: Creates a new chirp. Requires authentication. The body request must contain the `body` of the message (max 140 characters).
- **`DELETE /api/chirps/:chirpId`**: Deletes a chirp. Only the author of the chirp can delete it.

### Webhooks

- **`POST /api/polka/webhooks`**: Endpoint for Polka webhooks. Used to upgrade users to "Chirpy Red" status upon payment events. Requires a specific API Key.

### Admin

- **`GET /admin/metrics`**: Returns usage metrics (e.g., number of visits).
- **`POST /admin/reset`**: Resets the database state (only available in `dev` environment).

## Environment Variables

The application requires the following environment variables to be set (e.g., in a `.env` file):

- `DB_URL`: Connection string for the PostgreSQL database (e.g., `postgresql://user:password@localhost:5432/bootdev`).
- `PLATFORM`: The execution environment (e.g., `dev` or `prod`).
- `SECRET`: Secret key used for signing JWTs.
- `POLKA_KEY`: API Key for validating Polka webhooks.

## How to Run

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run migrations**:

    ```bash
    npm run db:migrate
    ```

3.  **Start the server**:
    - For development:
      ```bash
      npm run dev
      ```
    - For production:
      ```bash
      npm run start
      ```

## Testing

The project uses **Vitest** for testing. The tests mainly cover authentication logic (JWT generation and validation).

To run the tests:

```bash
npm run test
```
