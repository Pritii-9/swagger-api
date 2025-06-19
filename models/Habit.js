
import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', 
    required: true, 
  },
  name: {
    type: String,
    required: [true, 'Please add a habit name'], // Habit name is required
    trim: true, 
    maxlength: [100, 'Name can not be more than 100 characters'], // Max length for habit name
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters'], // Max length for description
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'], // Allowed frequencies
    default: 'daily', 
  },
  completionDates: [
    {
      type: Date,
      required: true, 
  ],
  createdAt: {
    type: Date,
    default: Date.now, 
});

export default mongoose.model('Habit', HabitSchema);