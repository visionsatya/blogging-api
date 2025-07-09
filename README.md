# Blog API

A comprehensive Node.js-based RESTful API for a blogging platform built with Express.js and MongoDB. This API supports user authentication, blog management, categories, tags, comments, and admin features.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Blog Management**: Create, read, update, delete, and publish blog posts
- **Categories & Tags**: Organize content with categories and tags
- **Comments System**: Full CRUD operations for blog comments
- **Admin Dashboard**: Analytics and user management
- **API Documentation**: Swagger/OpenAPI documentation
- **Pagination**: Built-in pagination for all list endpoints
- **Search & Filtering**: Advanced search and filtering capabilities

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Admin Setup](#admin-setup)
- [Development](#development)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Development**: nodemon

## 📁 Project Structure

```
blogapi/
├── createAdmin.js          # Admin user creation script
├── package.json
├── package-lock.json
├── src/
│   ├── app.js             # Express app configuration
│   ├── server.js          # Server entry point
│   └── api/
│       ├── v1/            # API version 1
│       │   ├── config/
│       │   │   └── db.js  # Database connection
│       │   ├── controllers/
│       │   │   ├── adminController.js
│       │   │   ├── authController.js
│       │   │   ├── blogController.js
│       │   │   ├── categoryController.js
│       │   │   ├── commentController.js
│       │   │   └── tagController.js
│       │   ├── middleware/
│       │   │   └── authMiddleware.js
│       │   ├── models/
│       │   │   ├── blogSchema.js
│       │   │   ├── categorySchema.js
│       │   │   ├── commentSchema.js
│       │   │   ├── tagSchema.js
│       │   │   └── userSchema.js
│       │   ├── routes/
│       │   │   ├── adminRoutes.js
│       │   │   ├── authRoutes.js
│       │   │   ├── blogRoute.js
│       │   │   ├── categoryRoutes.js
│       │   │   ├── commentRoutes.js
│       │   │   ├── healthRoutes.js
│       │   │   └── tagRoutes.js
│       │   └── validations/
│       │       ├── authValidation.js
│       │       ├── blogValidator.js
│       │       └── commentValidator.js
│       └── v2/            # Reserved for future updates
└── node_modules/
```

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blogapi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blogapi
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## 🗄 Database Setup

The API uses MongoDB with Mongoose. Make sure MongoDB is running on your system or use a cloud MongoDB service like MongoDB Atlas.

## 📚 API Documentation

The API documentation is available via Swagger UI at:

```
http://localhost:3000/api-docs
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **reader**: Can read blogs and add comments
- **author**: Can create, edit, and delete their own blogs
- **editor**: Can edit any blog and manage content
- **admin**: Full access to all features and admin dashboard

## 📡 API Endpoints

### Health Check

- `GET /api/v1/health` - Check server status

### Authentication

- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login user
- `POST /api/v1/logout` - Logout user
- `GET /api/v1/me` - Get current user profile
- `PUT /api/v1/me` - Update current user profile

### Blogs

- `POST /api/v1/createblog` - Create a new blog post
- `GET /api/v1/blogs` - Get all blogs (with pagination and filters)
- `GET /api/v1/blog/:id` - Get a specific blog
- `PUT /api/v1/blog/:id` - Update a blog
- `DELETE /api/v1/blog/:id` - Delete a blog
- `POST /api/v1/blog/:id/like` - Like a blog
- `POST /api/v1/blog/:id/dislike` - Dislike a blog
- `POST /api/v1/blog/:id/publish` - Publish a blog
- `POST /api/v1/blog/:id/unpublish` - Unpublish a blog

### Comments

- `POST /api/v1/blog/:blogId/comment` - Add a comment to a blog
- `GET /api/v1/blog/:blogId/comments` - Get all comments for a blog
- `PUT /api/v1/comment/:commentId` - Edit a comment
- `DELETE /api/v1/comment/:commentId` - Delete a comment

### Categories

- `POST /api/v1/category` - Create a new category
- `GET /api/v1/category` - Get all categories
- `GET /api/v1/category/:id` - Get a specific category
- `PUT /api/v1/category/:id` - Update a category
- `DELETE /api/v1/category/:id` - Delete a category

### Tags

- `POST /api/v1/tag` - Create a new tag
- `GET /api/v1/tag` - Get all tags
- `GET /api/v1/tag/:id` - Get a specific tag
- `PUT /api/v1/tag/:id` - Update a tag
- `DELETE /api/v1/tag/:id` - Delete a tag

### Admin (Admin only)

- `GET /api/v1/admin/analytics/overview` - Get overview analytics
- `GET /api/v1/admin/analytics/most-viewed-posts` - Get most viewed posts
- `GET /api/v1/admin/analytics/user-activity` - Get user activity logs

## 💡 Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "role": "author"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a blog post

```bash
curl -X POST http://localhost:3000/api/v1/createblog \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "excerpt": "A brief summary of the blog post",
    "tags": ["technology", "programming"],
    "category": "60d21b4667d0d8992e610c85",
    "isPublished": false
  }'
```

### Get all blogs with pagination

```bash
curl -X GET "http://localhost:3000/api/v1/blogs?page=1&limit=10&search=technology"
```

### Add a comment

```bash
curl -X POST http://localhost:3000/api/v1/blog/60d21b4667d0d8992e610c85/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "content": "Great article! Thanks for sharing."
  }'
```

## 👨‍💼 Admin Setup

To create an admin user, run the provided script:

```bash
node createAdmin.js
```

This will create an admin user with the following default credentials:

- **Username**: ssadmin
- **Email**: ssadmin@gmail.com
- **Password**: Ssadmin@123
- **Role**: admin

**Important**: Change these credentials in the `createAdmin.js` file before running the script in production.

## 🛠 Development

### Available Scripts

- `npm start` - Start the development server with nodemon
- `npm run dev` - Start the development server (if configured)

### Development Features

- **Hot Reload**: Server automatically restarts on file changes
- **Swagger Documentation**: Auto-generated API documentation
- **Error Handling**: Comprehensive error handling and validation
- **Logging**: Console logging for debugging

### Code Structure

- **Controllers**: Handle business logic and HTTP responses
- **Models**: Define database schemas and relationships
- **Routes**: Define API endpoints and middleware
- **Middleware**: Authentication and request processing
- **Validations**: Input validation and sanitization

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Role-based access control
- CORS protection
- Request rate limiting (can be added)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This API is designed for educational and development purposes. For production use, ensure proper security measures, environment configuration, and deployment practices are followed.
