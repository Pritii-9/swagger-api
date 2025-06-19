
import Habit from '../models/Habit.js'; // Import the Habit model
import asyncHandler from '../middleware/asyncHandler.js'; // Utility for handling async errors
import { habitSchema, updateHabitSchema, trackHabitSchema } from '../utils/joiValidation.js'; // Joi schemas for validation

const createHabit = asyncHandler(async (req, res) => {
  const { error } = habitSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { name, description, frequency } = req.body;

  const habit = await Habit.create({
    user: req.user._id, 
    name,
    description,
    frequency,
    completionDates: [], 
  });

  res.status(201).json(habit); // Respond with the created habit
});


const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id });
  res.status(200).json(habits); // Respond with the list of habits
});


const getHabitById = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (habit) {
    res.status(200).json(habit); // Respond with the habit
  } else {
    res.status(404);
    throw new Error('Habit not found or not authorized to view this habit');
  }
});


const updateHabit = asyncHandler(async (req, res) => {
  const { error } = updateHabitSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { name, description, frequency } = req.body;

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (habit) {
    habit.name = name || habit.name;
    habit.description = description || habit.description;
    habit.frequency = frequency || habit.frequency;

    const updatedHabit = await habit.save(); // Save the updated habit

    res.status(200).json(updatedHabit); // Respond with the updated habit
  } else {
    res.status(404);
    throw new Error('Habit not found or not authorized to update this habit');
  }
});


const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (habit) {
    await habit.deleteOne(); // Delete the habit
    res.status(200).json({ message: 'Habit removed' }); // Confirm deletion
  } else {
    res.status(404);
    throw new Error('Habit not found or not authorized to delete this habit');
  }
});

const trackHabitCompletion = asyncHandler(async (req, res) => {
  const { error } = trackHabitSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { date } = req.body;
  const completionDate = new Date(date); // Convert date string to Date object

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (habit) {
    const alreadyCompleted = habit.completionDates.some(
      (d) =>
        d.getFullYear() === completionDate.getFullYear() &&
        d.getMonth() === completionDate.getMonth() &&
        d.getDate() === completionDate.getDate()
    );

    if (alreadyCompleted) {
      res.status(400);
      throw new Error('Habit already marked as completed for this date.');
    }

    habit.completionDates.push(completionDate);
    const updatedHabit = await habit.save(); // Save the updated habit

    res.status(200).json(updatedHabit); // Respond with the updated habit
  } else {
    res.status(404);
    throw new Error('Habit not found or not authorized to track this habit');
  }
});


const getHabitHistory = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (habit) {
    const sortedCompletionDates = habit.completionDates.sort((a, b) => a - b);
    res.status(200).json({
      habit: habit.name,
      completionHistory: sortedCompletionDates,
    });
  } else {
    res.status(404);
    throw new Error('Habit not found or not authorized to view this habit history');
  }
});


const getHabitStatistics = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id });

  const statistics = habits.map((habit) => {
    const totalCompletions = habit.completionDates.length;

    let currentStreak = 0;
    if (totalCompletions > 0) {
      const sortedDates = habit.completionDates.map((d) => new Date(d.toDateString())).sort((a, b) => a - b);
      let lastDate = null;

      
      let today = new Date();
      today.setHours(0, 0, 0, 0); 

      let startDateForStreak = today;

      if (sortedDates.length > 0) {
        const latestCompletion = sortedDates[sortedDates.length - 1];
        if (latestCompletion.getTime() !== today.getTime()) {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          if (latestCompletion.getTime() === yesterday.getTime()) {
            startDateForStreak = yesterday; // Streak continues from yesterday
          } else if (latestCompletion < yesterday) {
            startDateForStreak = new Date(latestCompletion.setDate(latestCompletion.getDate() + 1)); // Streak broke, start from the day after last completion
          }
        }
      }

      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const currentDate = sortedDates[i];
        currentDate.setHours(0, 0, 0, 0); // Normalize current date

        if (lastDate === null) {
          if (currentDate.getTime() === today.getTime()) {
            currentStreak = 1;
            lastDate = currentDate;
          } else {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            if (currentDate.getTime() === yesterday.getTime()) {
              currentStreak = 1;
              lastDate = currentDate;
            } else {
              break;
            }
          }
        } else {
          const expectedPrevDate = new Date(lastDate);
          expectedPrevDate.setDate(lastDate.getDate() - 1);

          if (currentDate.getTime() === expectedPrevDate.getTime()) {
            currentStreak++;
            lastDate = currentDate;
          } else {
            break;
          }
        }
      }
    }


    let completionRate = 0;
    if (habit.createdAt) {
      const daysSinceCreation = Math.floor(
        (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceCreation > 0) {
        completionRate = (totalCompletions / daysSinceCreation) * 100;
      } else if (totalCompletions > 0) {
        completionRate = 100;
      }
    }


    return {
      habitId: habit._id,
      name: habit.name,
      totalCompletions: totalCompletions,
      currentStreak: currentStreak,
      completionRate: parseFloat(completionRate.toFixed(2)), // Format to 2 decimal places
    };
  });

  res.status(200).json(statistics);
});


export {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  trackHabitCompletion,
  getHabitHistory,
  getHabitStatistics,
};