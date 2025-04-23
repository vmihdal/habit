# Full Stack Authentication Starter

This project provides a basic authentication system with a NestJS backend and React frontend.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up your PostgreSQL database and update the `.env` file with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/nestjs_auth"
JWT_SECRET="your-secret-key"
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Start the backend server:
```bash
npm run start:dev
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Modern UI with Tailwind CSS
- TypeScript support
- PostgreSQL database with Prisma ORM

## Project Structure

- `backend/` - NestJS application with authentication endpoints
- `frontend/` - React application with login and registration forms 