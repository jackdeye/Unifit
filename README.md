# Unifit
CS35L Spring 2024 Final Project
- Selina Song, Fiona Peng, Aidan Van Duyne, Jack Deye, Clare Jin, Alyssa Leung

## Summary
Have you ever wondered why clothes are so expensive when you will get just a few uses out of them? Whether it is a nice suit needed for a presentation or a dress for a single night out with friends, uses for expensive clothes can be few and far between. 

Unifit: a platform that allows university students to effortlessly buy, sell, and rent clothes or other dorm necessities on campus without the hassle of shipping over an item from a stranger. Our goal is to fight against fast fashion, promote sustainability, and cultivate a close-knit community on university campuses. 
## Features
- User Authentication
  - After user logs in, they remain logged in for 1 hour then are automatically logged out for security.
- Gallery:
  - Filters: For Rent, For Buy, Posts from user's School, Fuzzy Find for searching through posts
- Profile
  - Upload profile picture, school, bio
  - Displays all purchased, rented posts, and user's own listings 
- Favorites
  - Displays all the posts a user has liked
- Product Page
  - Comments: Users submit comments for each post which are listed on ItemPage
  - Interactive Calendar for Rental Availability
    - On ItemPage, all available dates set by the post author are listed in green
    - Each time a date is rented out, it becomes unavailable in grey

## Technologies
- Frontend: React, Vite
- Backend: MongoDB, Node.js, Express

## Download the application
Clone the Repository:

```
git clone https://github.com/jackdeye/Unifit.git
cd Unifit
```

## Setup
### Backend Instructions
To set up the dependencies for the backend server, run:
```
cd Backend
npm install
```
Main backend dependencies:
- Express.js
- Multer
- JWT (json web token) and Bcrypt

 To run, you must download the config.env file containing the MongoDB account login and the JWT web token.
 
### Running
```
cd Backend
npm start
```
## Frontend Instructions
### Setup
To setup the dependencies for the frontend application, run:
```
cd Frontend
npm install
```
Main frontend dependencies:
- React.js
- react-router-dom
- react-datepicker
### Running
To start the frontend application, run:
```
cd Frontend
npm run dev
```
The frontend will be available on http://localhost:5173

Once frontend and backend are running, the application will be fully usable
