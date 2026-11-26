# 4231

A news, fixtures and standings site for the UEFA Champions League. Visitors can read news, check upcoming matches and results, and see the league phase table. Admins log in to manage the data: news can be added and deleted, and matches and standings can be added, edited and deleted.

This project was built for an RPL (software engineering) course.

## Repository layout

| Folder | Contents |
|---|---|
| `server/` | REST API: Express 5, Sequelize, MySQL |
| `client/` | Web app: React 19, Vite, Tailwind CSS 4 |
| `Bola/` | Expo (React Native) app with a static mock UI. Not connected to the API |
| `docs/design.md` | UI design: colors, fonts and components (in Indonesian) |

## Features

- News articles with images. Admins can upload jpg, png, webp or gif files up to 5 MB.
- Fixtures and results, split into Scheduled and Finished. A match in progress shows a Live badge and its score.
- League phase standings with colored zones: green for ranks 1 to 8 (round of 16), orange for 9 to 24 (knockout playoff), red for 25 and below (eliminated).
- An admin area at `/admin`. Every write endpoint in the API requires a login.

## Requirements

- Node.js 22 or newer
- MySQL or MariaDB (XAMPP works)

## Running locally

The commands below work in PowerShell as well as in Bash.

1. Start MySQL and create an empty database:

   ```sql
   CREATE DATABASE bola;
   ```

   The server creates the tables on first start.

2. Set up the server in one terminal:

   ```
   cd server
   cp .env.example .env
   npm install
   ```

   Open `server/.env` and replace `SESS_SECRET` and `JWT_SECRET` with random values. The example values are public, so do not run the server with them. One way to generate a value:

   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Then start the API, which listens on http://localhost:5000:

   ```
   npm run dev
   ```

3. Start the client in a second terminal:

   ```
   cd client
   cp .env.example .env
   npm install
   npm run dev
   ```

   Then open http://localhost:5173.

### Adding teams

Matches and standings both need teams, and the app has no page for creating them. Insert teams with SQL after the server has created the tables:

```sql
INSERT INTO bola.teams (name, logo_url, created_at, updated_at) VALUES
  ('Real Madrid', '/assets/rm.png', NOW(), NOW()),
  ('Barcelona', '/assets/barca.png', NOW(), NOW());
```

Club logos live in `client/public/assets/`, so `logo_url` is a path like `/assets/rm.png`.

### Creating an admin account

There is no sign-up page for admins either, so insert a row into the `admin` table:

```sql
INSERT INTO bola.admin (username, email, password, created_at, updated_at)
VALUES ('admin', 'admin@example.com', 'change-this-password', NOW(), NOW());
```

You can store the password as plain text, as long as it does not start with `$2` (the server treats those values as bcrypt hashes). After the first successful login the server replaces it with a bcrypt hash.

Log in at http://localhost:5173/admin with the email and password from the INSERT. The username is not used for login.

### News images

Uploaded images are saved in `server/public/uploads/` and are not tracked by git. If your database holds news created on another machine, those images will appear broken until you copy the original files into that folder.

## Commands

| Folder | Command | What it does |
|---|---|---|
| `server/` | `npm run dev` | Runs the API with auto-reload |
| `server/` | `npm start` | Runs the API without auto-reload |
| `server/` | `npm test` | Runs the server tests |
| `client/` | `npm run dev` | Runs the web app in development mode |
| `client/` | `npm run build` | Builds the production bundle into `client/dist/` |
| `client/` | `npm run lint` | Lints the code with ESLint |
| `client/` | `npm test` | Runs the client tests |

## API

All endpoints live under `/api`. Endpoints marked "admin" need a logged-in session.

| Method | Path | Description |
|---|---|---|
| GET | `/api/news` | The 20 newest news items |
| POST | `/api/news` | Add a news item (admin, `multipart/form-data` with an `image` field) |
| DELETE | `/api/news/:id` | Delete a news item (admin) |
| GET | `/api/matches` | List matches |
| GET | `/api/matches/:id` | One match |
| POST, PUT, DELETE | `/api/matches`, `/api/matches/:id` | Manage matches (admin) |
| GET | `/api/standings` | Standings, ordered by points |
| POST, PUT, DELETE | `/api/standings`, `/api/standings/:id` | Manage standings (admin) |
| GET | `/api/teams` | List teams |
| POST | `/api/admin/login` | Admin login |
| DELETE | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | The logged-in admin |

## Known limitations

- Standings are ordered by points, then wins, then team name. Goal difference is not used because the database has no goal columns, so two teams level on points at a zone boundary may get a different color than in UEFA's official table.
- Teams can only be added with SQL, and news cannot be edited after it is posted.
- The server only accepts requests from `http://localhost:3000` and `http://localhost:5173`. To run the client on another port, either add that port to the `origin` list in `server/index.js`, or leave `VITE_API_URL` empty in `client/.env` so the client goes through the Vite dev proxy.
