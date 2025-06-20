
# habit-tracker-backend/README.md
# Daily Habit Tracker Backend API

This project provides a robust and scalable backend API for a Daily Habit Tracker application. It allows users to manage their daily habits, track completion, and view progress statistics. The API is built with Node.js, Express.js, and MongoDB, ensuring a secure and efficient data management system.

## Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Habits](#habits)
- [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Input Validation](#input-validation)
- [Postman Collection](#postman-collection)
- [Future Enhancements (Bonus Features)](#future-enhancements-bonus-features)
- [License](#license)

## Features

### Core Features

1.  **User Registration and Authentication**: Secure user sign-up, login, and JWT-based authentication.
2.  **Create Habit**: Allows users to create new habits with customizable names, descriptions, and frequency (daily, weekly, etc.).
3.  **List Habits**: Retrieves all habits for the authenticated user.
4.  **Update Habit**: Enables users to update habit details.
5.  **Delete Habit**: Allows users to delete a habit.
6.  **Track Habit Completion**: Allows users to mark a habit as completed for a specific day.
7.  **Habit Completion History**: Retrieves historical completion data for each habit.
8.  **Statistics Endpoint**: Provides summary statistics (e.g., current streaks, total completions, completion rates) for user habits.

### Bonus Features (Mock/Conceptualized)

* **Reminders**: Conceptualized for scheduled reminder notifications (e.g., via email or push, mock implementation acceptable). This would typically involve a separate service or cron job.
* **Social Sharing**: Endpoints for sharing habit progress with other users could be added (e.g., `/api/habits/{id}/share`).
* **Habit Categories**: Users could categorize habits (e.g., Health, Productivity) by adding a `category` field to the Habit schema.

## Technical Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (via Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT)
* **Password Hashing**: bcryptjs
* **Validation**: Joi
* **Environment Variables**: dotenv
* **API Documentation**: Swagger UI Express, YAMLJS
* **CORS**: cors middleware

#   s w a g g e r - a p i  
 