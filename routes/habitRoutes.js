
import express from 'express';
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  trackHabitCompletion,
  getHabitHistory,
  getHabitStatistics,
} from '../controllers/habitController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router(); 
router.route('/').post(protect, createHabit).get(protect, getHabits);

router.route('/:id')
  .get(protect, getHabitById) 
  .put(protect, updateHabit) 
  .delete(protect, deleteHabit); 

router.post('/:id/track', protect, trackHabitCompletion);

router.get('/:id/history', protect, getHabitHistory);

router.get('/statistics', protect, getHabitStatistics);

export default router; 