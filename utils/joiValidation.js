
import Joi from 'joi';
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const habitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.min': 'Habit name must be at least 1 character long',
    'string.max': 'Habit name cannot exceed 100 characters',
    'string.empty': 'Habit name is required',
    'any.required': 'Habit name is required',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'custom').default('daily').messages({
    'any.only': 'Frequency must be one of daily, weekly, monthly, or custom',
  }),
});

// Joi schema for updating an existing habit
const updateHabitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional().messages({
    'string.min': 'Habit name must be at least 1 character long',
    'string.max': 'Habit name cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'custom').optional().messages({
    'any.only': 'Frequency must be one of daily, weekly, monthly, or custom',
  }),
}).min(1).messages({ // Ensure at least one field is provided for update
  'object.min': 'At least one field (name, description, or frequency) must be provided to update a habit.',
});

const trackHabitSchema = Joi.object({
  date: Joi.date().iso().required().messages({ // Expects ISO 8601 date string
    'date.base': 'Please provide a valid date',
    'date.format': 'Date must be in ISO 8601 format (e.g.,YYYY-MM-DD)',
    'any.required': 'Date is required to track habit completion',
  }),
});


export {
  registerSchema,
  loginSchema,
  habitSchema,
  updateHabitSchema,
  trackHabitSchema,
};
