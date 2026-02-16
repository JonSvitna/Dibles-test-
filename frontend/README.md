# Frontend (Vercel)

React frontend application built with Vite for the Dibles test application.

## Features

- Modern React with Vite (replaces deprecated webpack)
- Fast Hot Module Replacement (HMR)
- Optimized production builds
- API integration with Railway backend

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `VITE_API_URL` in `.env` to point to your backend:
```
VITE_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = Your Railway backend URL
5. Deploy!

### Manual Deployment

```bash
npm install -g vercel
vercel --prod
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (required for production)

## Why Vite instead of Webpack?

Vite offers:
- ⚡ Lightning-fast cold starts
- 🔥 Instant Hot Module Replacement
- 📦 Optimized builds with Rollup
- 🛠️ Modern tooling and better DX
- 🎯 Out-of-the-box TypeScript support

## Technical Details

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

