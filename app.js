import 'dotenv/config'; // ES module way to load dotenv

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // For handling Cross-Origin Resource Sharing
import swaggerUi from 'swagger-ui-express'; // For Swagger UI
import YAML from 'yamljs'; // For parsing YAML Swagger definition
import path from 'path'; // Node.js path module for resolving file paths
import { fileURLToPath } from 'url'; // Utility to convert file URL to path

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database connection function
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';

// Import custom error handling middleware
import errorHandler from './middleware/errorHandler.js';

// Initialize Express application
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware setup
// Enable CORS for all routes, allowing frontend applications from different origins to access the API.
app.use(cors());
// Parse incoming JSON requests. This makes req.body available for JSON payloads.
app.use(express.json());

// Serve Swagger documentation
// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
// Set up Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define API routes
// Auth routes for user registration and login
app.use('/api/auth', authRoutes);
// Habit routes for managing habits, protected by authentication middleware
app.use('/api/habits', habitRoutes);

// Global error handling middleware (must be the last middleware)
app.use(errorHandler);

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});