# Backend (Railway)

Node.js Express backend server for the Dibles test application.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`

3. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/test` - Test endpoint
- `GET /api/county-tests` - County tests data

## Deployment to Railway

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically detect the Node.js application
4. Set environment variables in Railway dashboard if needed
5. Deploy!

Railway will use the `npm start` command to run the server.
