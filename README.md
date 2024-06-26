# Pollapex

> A full stack JS web app for building surveys. It provides a user-friendly tool for collecting insights and feedback from audiences. Secure and easy makes it easy to share surveys and analyze results.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create surveys with custom questions
- Share surveys via a unique URL
- Collect responses and display results in a dashboard
- Export responses to an Excel file for further analysis
- Authentication and authorization using JWT

## Technologies

- MongoDB: NoSQL database to store survey data
- Express: Backend framework to create RESTful APIs
- React: Frontend library to create user interface
- Node.js: Runtime environment for server-side JavaScript

## Setup

1. Clone the repository:
   git clone https://github.com/<your-username>/Pollapex.git

2. Install dependencies:
   cd Pollapex
   npm install

3. Create a `.env` file in the root directory and add the following environment variables:
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pollapex
   JWT_SECRET=
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30

4. Start the development server:
   npm run dev

## API Endpoints

| Endpoint                          | Method | Description              |
| --------------------------------- | ------ | ------------------------ |
| /api/auth/signup                  | POST   | Register a new user      |
| /api/auth/signin                  | POST   | Log in an existing user  |
| /api/auth/me                      | POST   | Get current user         |
| /api/surveys                      | GET    | Get all user surveys     |
| /api/surveys                      | POST   | Create a new survey      |
| /api/surveys/:id                  | GET    | Get a survey by ID       |
| /api/surveys/:id                  | PUT    | Update a survey by ID    |
| /api/surveys/:id                  | DELETE | Delete a survey by ID    |
| /api/questions/:id                | GET    | Get a question by ID     |
| /api/questions/:id                | PUT    | Update a question by ID  |
| /api/questions/:id                | DELETE | Delete a question by ID  |
| /api/responses                    | GET    | Get all responses        |
| /api/suveys/:id/responses         | POST   | Create a new response    |
| /api/surveys/:id/responses        | GET    | Get a survey responses   |
| /api/responses/:id                | PUT    | Update a response by ID  |
| /api/responses/:id                | DELETE | Delete a response by ID  |
| /api/surveys/:id/responses/export | DELETE | Export data with exceljs |

## Contributing

Contributions are welcome! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make changes and commit: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
