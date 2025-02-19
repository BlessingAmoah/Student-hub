# Student Hub - Setup and Installation Guide

This guide explains how to install, configure, and run the student hub web application. Follow the steps to get the project running on your local machine.

# Aim for this project
Student hub serves as a tool for collaborative learning and as a platform for sharing experiences related to internships, summer plans, and student organizations. Users will be able to post information about their classes, projects they are interested in or working on, and other users with the same interests can comment on such posts to collaborate or give feedback. Users will be able to create an account using their .edu emails only.

# Prerequisites

Before proceeding, ensure you have the following installed on your system:

# Required Software

- Node.js (v18 or later)
- npm (included with node.js) or yarn
- PostgreSQL (latest version)
- Git
- React.js
- Homebrew ( for macOS users, optional but recommended)
- AWS S3 bucket (object storage)

# 1. Clone the repository
git clone https://github.com/BlessingAmoah/student-hub.git

cd student-hub

# 2. Install Dependencies

Navigate to the backend and frontend folders and install dependencies:

Backend:

cd backend
- npm install
- Express.js - Backend framework
- Sequelize & PostgreSQL - Database ORM
- bcrypt - Password hashing
- jsonwebtoken - Authentication
- nodemailer - Email services
- multer & AWS SDK - File uploads
- express-validator - Input validation
- react-router-dom - Routing

Frontend:
cd frontend
- npm install
- React.js - Frontend framework
- Material UI - UI components
- react-router-dom - Routing
- axios - API requests

# 3. Set Up the Database

Ensure PostgreSQL is installed and running:

macOS:
brew install postgresql
brew services start postgresql

Ubuntu/ Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

Windows:
Download and install https://www.postgresql.org/download/, then start the database server using the PostgreSQL service.

Create the Database
psql -U postgres
CREATE DATABASE student_hub;

If you set a password for PostgreSQL, update the .env file accordingly.

# 4. Configure Environment Variables

Create a .env file in the backend directory with the following content:

NODE_ENV=development

PORT=5000

DATABASE_URL=postgres://username:password@localhost:5432/student_hub

JWT_SECRET=your_jwt_secret

CLOUD_STORAGE_BUCKET=your_bucket_name

EMAIL_SERVICE=your_email_service

EMAIL_USER=your_email@example.com

EMAIL_PASS=your_email_password

Note: Replace username, password, and other placeholders with your actual credentials.

# 5. Run Database Migrations

cd backend

npx sequelize-cli db:migrate

# 6. Start Application

Backend Application

cd backend

node server.js

Frontend Application

cd frontend

npm start

# 7. Access the Application

Once the frontend and backend are running, open your browser and go to:
http://localhost:3000

# Deployment
To deploy the project, configure environment variables and deploy using Render, Heroku, or Vercel.

# Contribution
Feel free to fork the repository and submit pull requests.

# Running Tests

To run tests, use the following commands:

Backend:

cd backend

npm test

Frontend:

cd frontend

npm test

# License

MIT License

Copyright (c) 2025 Blessing Amoah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
