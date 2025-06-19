
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js'; // Import controller functions

const router = express.Router(); 

router.post('/register', registerUser);

router.post('/login', loginUser);

export default router; 