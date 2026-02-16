# Dibles-test-

County tests application with backend hosted on Railway and frontend hosted on Vercel.

## Architecture

- **Backend**: Node.js/Express server hosted on Railway
- **Frontend**: React application built with Vite, hosted on Vercel
- **Build Tool**: Vite (modern alternative to deprecated webpack)

## Project Structure

```
├── backend/          # Express server for Railway
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
├── frontend/         # React application for Vercel
│   ├── src/          # Source files
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
├── railway.json      # Railway deployment configuration
├── vercel.json       # Vercel deployment configuration
└── Procfile          # Alternative Railway configuration
```

## Quick Start

### Backend (Local Development)

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend (Local Development)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs on `http://localhost:5173`

## Deployment

### Deploy Backend to Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repository
   - Railway will automatically detect the Node.js application

2. **Configuration**
   - Railway uses `railway.json` for build/deploy configuration
   - Or alternatively uses `Procfile`
   - Set environment variables in Railway dashboard if needed

3. **Deploy**
   - Railway automatically deploys on push to main branch
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Deploy Frontend to Vercel

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Vite configuration

2. **Environment Variables**
   - Add in Vercel dashboard:
     - `VITE_API_URL` = Your Railway backend URL

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Frontend is live at your Vercel domain

## API Endpoints

- `GET /health` - Health check
- `GET /api/test` - Test endpoint
- `GET /api/county-tests` - County tests data

## Technology Stack

### Backend
- Node.js
- Express.js
- CORS for cross-origin requests
- dotenv for environment variables

### Frontend
- React 19
- Vite 8 (beta)
- Modern ES modules
- Fast HMR (Hot Module Replacement)

## Why Vite over Webpack?

This project uses Vite instead of the deprecated webpack setup because:

- ⚡ **Faster**: Lightning-fast cold starts and HMR
- 🎯 **Modern**: Native ES modules, no bundling in dev
- 📦 **Optimized**: Better production builds with Rollup
- 🛠️ **Simple**: Less configuration, better defaults
- 🔮 **Future-proof**: Active development and modern architecture

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## License

See LICENSE file for details.

