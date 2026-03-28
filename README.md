# ExpressConnect

A full-stack web application for creating, sharing, and managing posts with user authentication and image uploads. Built with Node.js, Express, and Handlebars.

## Overview

ExpressConnect is a blogging platform that allows users to:
- Create an account and log in securely
- Write and publish posts with optional image attachments
- View all public posts on the home page
- Manage their own posts (view, edit, delete)
- Access posts via REST API endpoints

## Features

### Authentication
- User login with JWT (JSON Web Tokens)
- Secure token storage in HTTP cookies
- Protected routes that require authentication
- Token verification on every request

### Post Management
- **Create Posts**: Add new posts with title, content, and optional image uploads
- **Read Posts**: 
  - View all public posts on the home page
  - View personal posts with pagination
  - Access posts via REST API
- **Update Posts**: Edit existing posts (title and content)
- **Delete Posts**: Remove posts permanently
- **Image Uploads**: Attach images to posts using Multer

### Pagination
- Posts are paginated (5 posts per page)
- Navigation between pages with previous/next buttons
- Dynamic page number links

### API Endpoints
- REST API for programmatic access to posts
- JSON responses for API requests
- Both public and protected endpoints

## Tech Stack

### Backend
- **Express.js** 5.2.1 - Web framework
- **Node.js** - JavaScript runtime
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Frontend
- **Handlebars** - Template engine
- **Express Handlebars** - Handlebars integration for Express
- **HTML/CSS** - Markup and styling

### Utilities
- **Cookie Parser** - Parse cookies in requests
- **Nodemon** - Development auto-reload

## Project Structure

```
ExpressConnect-AF_Lab6/
├── server.js                  # Main application file
├── package.json              # Project dependencies
├── middleware/
│   └── authMiddleware.js     # JWT authentication logic
├── routes/
│   ├── authRoutes.js         # Login/authentication routes
│   └── postRoutes.js         # Post CRUD routes
├── data/
│   └── postStore.js          # In-memory post storage
├── views/
│   ├── layouts/
│   │   └── main.handlebars   # Base layout template
│   ├── home.handlebars       # Home page - all public posts
│   ├── login.handlebars      # Login page
│   ├── posts.handlebars      # User's posts with pagination
│   ├── addPost.handlebars    # Add new post form
│   └── editPost.handlebars   # Edit post form
└── uploads/                  # Uploaded images directory
```

## Installation

### Prerequisites
- Node.js 14+ and npm

### Setup

1. Navigate to the project directory:
```bash
cd ExpressConnect-AF_Lab6
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Login Credentials

The application comes with two pre-configured users:

| Username | Password |
|----------|----------|
| admin    | 1234     |
| user     | 1234     |

### Workflow

1. **Visit Home Page**: Go to `http://localhost:3000` to see all public posts
2. **Login**: Click login link and authenticate with one of the credentials above
3. **Create Post**: Navigate to "Add New Post" and create your first post (with optional image)
4. **Manage Posts**: View your posts with pagination, edit or delete them as needed
5. **Logout**: Click logout to end your session

## API Endpoints

### Authentication Routes
- `GET /login` - Login page
- `POST /login` - Submit login credentials

### Post Routes (HTML Views)
- `GET /posts/view` - View user's posts (paginated) - **Protected**
- `GET /posts/add` - Add post form - **Protected**
- `POST /posts/add` - Create new post with optional image - **Protected**
- `GET /posts/edit/:id` - Edit post form - **Protected**
- `POST /posts/edit/:id` - Submit post updates - **Protected**
- `POST /posts/delete/:id` - Delete a post - **Protected**

### Post API Routes (JSON)
- `GET /posts` - Get all posts as JSON
- `GET /posts/:id` - Get specific post by ID
- `POST /posts/secure` - Create post via API (JSON) - **Protected**

## Data Structure

### User Object
```javascript
{
  id: number,
  username: string,
  password: string  // Note: In production, use bcrypt
}
```

### Post Object
```javascript
{
  id: number,
  title: string,
  content: string,
  author: string,
  image: string | null  // URL path to uploaded image
}
```

## Security Notes

⚠️ **Important**: This is a lab project for learning purposes. In production:

1. **Password Security**: Use bcrypt or similar to hash passwords, never store plaintext
2. **Environment Variables**: Store `SECRET_KEY` in environment variables, not hardcoded
3. **HTTPS**: Use HTTPS instead of HTTP
4. **CORS**: Implement proper CORS policies
5. **Input Validation**: Add comprehensive input validation and sanitization
6. **File Upload**: Implement file type validation and size limits
7. **Database**: Replace in-memory storage with a real database (MongoDB, PostgreSQL, etc.)

## File Upload

Posts support image uploads:
- Images are stored in the `/uploads` directory
- Filenames are generated with timestamps to avoid conflicts
- Images are displayed in posts if available

## Development

### Run Development Server
```bash
npm run dev
```

Nodemon will automatically restart the server when file changes are detected.

### File Organization

- **Middleware**: Authentication logic separated in `authMiddleware.js`
- **Routes**: Organized by feature (auth and posts)
- **Data**: In-memory storage in `postStore.js` with CRUD functions
- **Views**: Organized Handlebars templates for different pages

## License

ISC

## Notes

- Posts are retrieved in reverse chronological order (newest first)
- Authentication tokens persist across browser sessions via cookies
- User posts are only visible to that authenticated user (except home page shows all)
- All posts are displayed on the public home page regardless of author

---

**Created as part of AF Lab 06** - A learning project demonstrating Express.js fundamentals including routing, middleware, authentication, file uploads, and templating.
