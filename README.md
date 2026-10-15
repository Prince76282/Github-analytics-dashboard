# GITHUBRUPOCONTECTER

A full-stack web application to search GitHub repositories, inspect commit histories and contributor statistics, and save favourite repositories.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, TanStack React Query, Recharts, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, MongoDB / Mongoose, Vitest
- **External API**: GitHub REST API (proxied through the backend with in-memory caching)

## Features

- **Search Repositories**: Search GitHub repositories by name, keyword, or organization with sorting by stars or updated date.
- **Repository Details**:
  - Overview cards with star count, forks, watchers, license, and default branch
  - Commit activity chart and star/fork comparison
  - List of the latest 5 commits
  - Top 5 contributors ranking
  - Issues count with pull requests separated
- **Saved Bookmarks**: Save repositories to MongoDB Atlas with duplicate prevention.
- **Theme Switcher**: Multiple color themes (Default Slate, Deep Midnight, Warm Charcoal, Forest Emerald).

## Project Structure

```
github-analytics-dashboard/
├── frontend/                         # Next.js + React + Tailwind CSS
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   ├── src/
│   │   ├── app/                      # Next.js App Router pages
│   │   ├── components/               # UI and feature components
│   │   ├── hooks/                    # Custom React Query hooks
│   │   ├── services/                 # API client services
│   │   ├── providers/                # Theme and Query providers
│   │   ├── config/                   # Themes and navigation configs
│   │   ├── types/                    # TypeScript interfaces
│   │   └── lib/                      # Helper utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.mjs
│
├── backend/                          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/                   # Database and env configs
│   │   ├── controllers/              # Request handlers
│   │   ├── middleware/               # Validation and error handling
│   │   ├── models/                   # Mongoose schemas
│   │   ├── repositories/             # Database access layer
│   │   ├── routes/                   # Express routes
│   │   ├── services/                 # GitHub API and caching logic
│   │   ├── tests/                    # Integration and unit tests
│   │   ├── types/                    # Shared types
│   │   ├── utils/                    # Error helpers
│   │   ├── app.ts                    # Express app configuration
│   │   └── server.ts                 # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                      # Root workspace scripts
├── README.md                         # Project documentation
└── interview.md                      # Architecture guide & interview notes
```

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Ensure your `.env` has:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=optional_github_token_for_higher_rate_limits
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
# or build and run production:
npm run build
npm start
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Running Tests

```bash
cd backend
npm test
```
