Student Hub – Setup & Installation Guide

Student Hub is a web-based platform designed to foster collaborative learning and knowledge-sharing among students. Users can share posts about internships, courses, summer plans, and student organizations. Others can interact by commenting, providing feedback, or collaborating on shared interests. Account registration is restricted to .edu email addresses, with optional email verification enabled.


🚀 Features
	•	Post updates about classes, projects, and experiences.
	•	Collaborate through comments and feedback.
	•	Friend and mentorship system.
	•	Optional email verification.
	•	Demo mode available for testing without full setup.

📦 Getting Started

⚠️ You’ll need two separate terminals to run the frontend and backend servers concurrently.

1. Prerequisites

Ensure the following are installed:
	•	Node.js (v18 or later)
	•	npm or yarn
	•	Git
	•	PostgreSQL (optional if using Docker)
	•	Docker & Docker Compose (optional but recommended)
	•	AWS S3 bucket (optional, used for file uploads)

2. Clone the Repository

git clone https://github.com/BlessingAmoah/student-hub.git
cd student-hub


3. Install Dependencies

Backend

cd backend
npm install

Frontend

Open a new terminal:

cd frontend
npm install

4. Configure Environment Variables

In the backend directory:
	1.	Copy the example template:

cp .env.template .env

	2.	Fill in the values inside .env:

NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/student_hub
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLOUD_STORAGE_BUCKET=optional_bucket_name
DEMO_MODE=true

.env is already included in .gitignore for security.

For demo mode, set DEMO_MODE=true and use the provided seed data.


5. Set Up the Database (Optional if using Docker)

macOS

brew install postgresql
brew services start postgresql

Ubuntu/Debian

sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

Windows

Download and install from: https://www.postgresql.org/download/

Create the database:

psql -U postgres
CREATE DATABASE student_hub;


6. Run Database Migrations

cd backend
npx sequelize-cli db:migrate


7. Start the Application

Backend (Terminal 1)

cd backend
node server.js

Frontend (Terminal 2)

cd frontend
npm start


8. Access the Application

Once running, open your browser and go to:
🔗 http://localhost:3000

🐳 Using Docker (Recommended for Quick Start)

docker-compose up --build

This will spin up both the backend and frontend along with a PostgreSQL container pre-configured.

📮 Optional Email Setup

If you’d like to enable email verification or password resets:
	1.	Use any SMTP provider (e.g., Gmail, SendGrid).
	2.	Update the following environment variables:

EMAIL_SERVICE=gmail
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password

Gmail users: Enable 2FA and create an App Password for authentication.

🧪 Running Tests

Backend

cd backend
npm test

Frontend

cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm test


🌍 Deployment

To deploy:
	•	Ensure all environment variables are configured for production.
	•	Deploy backend to Render, Railway, or Heroku.
	•	Deploy frontend to Vercel or Netlify.

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.
