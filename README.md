# 4-2-3-1

A news, fixtures and standings site for the UEFA Champions League. Visitors can read news, check upcoming matches and results, and see the league phase table. Admins log in to add, edit and delete that data.

This project was built for an RPL (software engineering) course.

## Repository layout

| Folder | Contents |
|---|---|
| `server/` | REST API: Express 5, Sequelize, MySQL |
| `client/` | Web app: React 19, Vite, Tailwind CSS 4 |
| `Bola/` | Expo (React Native) app. Still the starter template and not connected to the API |
| `docs/design.md` | UI design: colors, fonts and components (in Indonesian) |

## Features

- News articles with images. Admins can upload jpg, png, webp or gif files up to 5 MB.
- Fixtures and results, split into Scheduled and Finished. A match in progress shows a Live badge and its score.
- League phase standings with colored zones: green for ranks 1 to 8 (round of 16), orange for 9 to 24 (knockout playoff), red for 25 and below (eliminated).
- An admin area at `/admin`. Every write endpoint in the API requires a login.

## Requirements

- Node.js 20 or newer
- MySQL or MariaDB (XAMPP works)

## Running locally

1. Start MySQL and create an empty database:

   ```sql
   CREATE DATABASE bola;
   ```

   The server creates the tables on first start.

2. Start the server in one terminal:

   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```

   Before running it, replace `SESS_SECRET` and `JWT_SECRET` in `server/.env` with random values. One way to generate them:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   The API listens on http://localhost:5000.

3. Start the client in a second terminal:

   ```bash
   cd client
   cp .env.example .env
   npm install
   npm run dev
   ```

   Then open http://localhost:5173.

### Creating an admin account

There is no sign-up page for admins, so insert a row into the `admin` table yourself:

```sql
INSERT INTO bola.admin (username, email, password, created_at, updated_at)
VALUES ('admin', 'admin@example.com', 'change-this-password', NOW(), NOW());
```

You can store the password as plain text. After the first successful login the server replaces it with a bcrypt hash. Log in at http://localhost:5173/admin.

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
| GET | `/api/news` | List news, newest first |
| POST | `/api/news` | Add a news item (admin, `multipart/form-data` with an `image` field) |
| DELETE | `/api/news/:id` | Delete a news item (admin) |
| GET | `/api/matches` | List matches |
| POST, PUT, DELETE | `/api/matches`, `/api/matches/:id` | Manage matches (admin) |
| GET | `/api/standings` | Standings, ordered by points |
| POST, PUT, DELETE | `/api/standings`, `/api/standings/:id` | Manage standings (admin) |
| GET | `/api/teams` | List teams |
| POST | `/api/admin/login` | Admin login |
| DELETE | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | The logged-in admin |

## Known limitations

- Standings are ordered by points, then wins, then team name. Goal difference is not used because the database has no goal columns, so two teams level on points at a zone boundary may get a different color than in UEFA's official table.
- The server only accepts requests from `http://localhost:3000` and `http://localhost:5173`. If you run the client on another port, add it to the `origin` list in `server/index.js`.
