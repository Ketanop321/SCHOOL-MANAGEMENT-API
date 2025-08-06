# School Management API

A RESTful API for managing schools with proximity-based search functionality.

## Features

- Add new schools with name, address, and coordinates
- List all schools sorted by distance from a given location
- Input validation
- Error handling
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database named `school_db`
   - Run the following SQL to create the schools table:
     ```sql
     CREATE TABLE schools (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         address VARCHAR(255) NOT NULL,
         latitude FLOAT NOT NULL,
         longitude FLOAT NOT NULL
     );
     ```

## Deployment to Render.com

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `school-api`
     - Region: Choose the one closest to your users
     - Branch: `main`
     - Build Command: `npm install`
     - Start Command: `node index.js`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=10000
     DATABASE_URL=your_postgres_connection_string
     ```
   - Click "Create Web Service"

3. **Set up PostgreSQL Database**
   - In the Render Dashboard, click "New" > "PostgreSQL"
   - Name: `school-db`
   - Database: `school_db`
   - User: (auto-generated)
   - Copy the connection string
   - Go back to your Web Service settings and update `DATABASE_URL` with this connection string

4. **Deploy**
   - Render will automatically deploy your application
   - Wait for the build to complete
   - Your API will be available at `https://school-api.onrender.com`

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`

5. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Add a new school
- **URL**: `POST /api/addSchool`
- **Request Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.34,
    "longitude": 56.78
  }
  ```

### List schools by proximity
- **URL**: `GET /api/listSchools?latitude=12.34&longitude=56.78`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 12.34,
      "longitude": 56.78,
      "distance": 0
    }
  ]
  ```

## Testing

You can use the included Postman collection to test the API endpoints.

## License

MIT
# SCHOOL-MANAGEMENT-API
