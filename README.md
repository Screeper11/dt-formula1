# Formula 1 Drivers Information App

This project is a simple web application displaying and mutating information of Formula 1 drivers. It uses Node.js and Express for the backend, React for the frontend, and is written in modern TypeScript.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Git

### Installation

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

> [!NOTE]  
> If install runs into a peerDependencies conflict, use the following command instead
```bash
cd backend && npm install && cd ../frontend && npm install --legacy-peer-deps && cd ..
```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend && npm start
   ```

2. In a new terminal, start the frontend application:
   ```bash
   cd frontend && npm start
   ```

The application will be running on `http://localhost:3000`.

## Features

### Backend

- JSON data source for driver information.
- `GET api/drivers` endpoint to serve data about all drivers.
- Random assignment of places to drivers on startup.
- Static serving of driver photos.
- `POST api/drivers/{driverId}/overtake` endpoint for overtaking logic.

### Frontend

- Single page on `/drivers` route.
- Displays driver names, teams, places, codes, and photos.
- Button/arrow for overtaking functionality.
- Minimal styling.

## Additional Features

- Displaying driver's home country flag.
- Functionality for overtaking multiple drivers at once.
- Drag and drop reorder functionality.
- Dockerization of the application.
- PostgreSQL database for data persistence.
- CSS animations for reordering drivers.
- Basic backend tests with Jest.

## Demonstration Video

A brief demonstration of the application is available [here]([Loom link]).

---

Developed by Bence Papp
