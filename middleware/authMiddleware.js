
import jwt from 'jsonwebtoken'; // For handling JSON Web Tokens
import User from '../models/User.js'; // User model to find user by ID
import asyncHandler from './asyncHandler.js'; // Utility for handling async errors

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the decoded token payload and attach to request object
      // Exclude password from the fetched user data
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(401); 
      throw new Error('Not authorized, token failed'); 
    }
  }

  // If no token is provided in the header
  if (!token) {
    res.status(401); // Set status to Unauthorized
    throw new Error('Not authorized, no token'); // Throw a specific error message
  }
});

export { protect }; // Export the protect middleware