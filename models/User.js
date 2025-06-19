
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For password hashing

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'], // Username is required
    unique: true, 
    trim: true, 
  },
  email: {
    type: String,
    required: [true, 'Please add an email'], // Email is required
    unique: true, // Email must be unique
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email', // Email format validation
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'], // Password is required
    minlength: [6, 'Password must be at least 6 characters'], // Minimum password length
    select: false, 
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
});

UserSchema.pre('save', async function (next) {
  // Only hash if the password has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt with 10 rounds
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model('User', UserSchema);
