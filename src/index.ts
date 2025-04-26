import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { specs, swaggerUi } from './utils/swagger';
import cors from 'cors';
import { initDatabase } from './db';

// Load environment variables
dotenv.config();

// Log environment status for debugging
console.log('Environment setup:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || 'not set');
console.log('- SOLANA_RPC_URL:', process.env.SOLANA_RPC_URL ? 'configured' : 'not configured');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'configured' : 'not configured');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Root endpoint redirects to docs
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Initialize database before starting the server
initDatabase()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
