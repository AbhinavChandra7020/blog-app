# Blog Platform

A modern, full-stack blog platform built with Next.js 15, MongoDB, and TypeScript. Features rich text editing, SEO optimization, and a clean admin interface.

## Features

### Core Functionality
- **Rich Text Editor**: Powered by React Quill with full formatting capabilities
- **SEO Optimized**: Automatic meta title and description generation
- **Search**: Real-time search through posts by title and content
- **Admin Dashboard**: Complete CRUD operations for blog management
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **Next.js 15**: Latest Next.js with App Router
- **TypeScript**: Full type safety throughout the application
- **MongoDB**: Efficient data storage with Mongoose ODM
- **Authentication**: NextAuth.js with credentials provider
- **Auto-Generated Slugs**: URL-friendly slugs with conflict resolution
- **Dark Theme**: Custom green color palette with theme toggle

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **Rich Text**: React Quill
- **Styling**: Tailwind CSS with custom green theme
- **Database**: MongoDB with connection caching

## Project Structure

```
app/
├── _components/           # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── AdminPage.tsx
│   │   ├── Homepage.tsx
│   │   └── SignInPage.tsx
│   ├── ui/               # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── PostCard.tsx
│   ├── RichTextEditor.tsx
│   ├── SearchBar.tsx
│   └── ThemeToggler.tsx
├── _lib/                 # Database and models
│   ├── db.ts
│   └── models/
│       └── Post.ts
├── _utils/               # Utility functions
│   ├── auth.ts
│   ├── metaGen.ts
│   └── slugify.ts
├── api/                  # API routes
│   ├── auth/
│   │   └── [...nextauth]/
│   └── posts/
│       ├── create/
│       ├── [slug]/
│       └── route.ts
├── admin/                # Admin dashboard
├── auth/                 # Authentication pages
├── posts/                # Blog post pages
├── globals.css           # Global styles and Quill theming
├── layout.tsx           # Root layout
├── page.tsx             # Homepage
└── providers.tsx        # Context providers
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/blog-platform

   # Authentication
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000

   # Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Homepage: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Sign In: http://localhost:3000/auth/signin

## 📊 Database Schema

### Post Model
```typescript
{
  title: String (required)
  content: String (required) 
  slug: String (required, unique)
  metaTitle: String (auto-generated)
  metaDescription: String (auto-generated)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Authentication

- **Admin-only access**: Single admin user system
- **Credentials**: Set via environment variables
- **Protected routes**: Admin dashboard requires authentication
- **Session management**: JWT-based sessions with NextAuth.js

## ✨ Key Features Explained

### Automatic SEO Generation
- **Meta titles**: Truncated to 55 characters with "..." if needed
- **Meta descriptions**: Generated from post content, max 155 characters
- **HTML tag removal**: Strips formatting for clean descriptions

### Smart Slug Generation
- **URL-friendly**: Converts titles to lowercase, dash-separated slugs
- **Conflict resolution**: Automatically appends numbers for duplicates
- **Update handling**: Regenerates slugs when titles change

### Rich Text Editor
- **Full formatting**: Headers, lists, links, images, code blocks
- **Dark theme**: Custom styling to match site design
- **Client-side only**: Prevents SSR hydration issues

### Search Functionality
- **Real-time**: Search posts by title and content
- **Case-insensitive**: MongoDB regex search
- **Clear filters**: Easy reset to view all posts

## 🎨 Design System

### Color Palette
- **Dark Green** (`#132a13`): Primary background
- **Hunter Green** (`#31572c`): Secondary backgrounds
- **Fern Green** (`#4f772d`): Accent color
- **Moss Green** (`#90a955`): Muted text
- **Mindaro** (`#ecf39e`): Primary text

### Component Library
- **Button**: Multiple variants (primary, secondary, outline, danger)
- **Input**: Consistent styling with error states
- **Card**: Reusable container with hover effects
- **Loading**: Configurable spinner component

## 📱 API Endpoints

### Posts API
- `GET /api/posts` - List all posts with optional search
- `POST /api/posts/create` - Create new post
- `GET /api/posts/[slug]` - Get single post by slug
- `PUT /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post

### Authentication API
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out user

## Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

### Environment Setup
- **Development**: Hot reload with Next.js dev server
- **Production**: Optimized build with static generation
- **Database**: MongoDB connection with caching

## Deployment

### Prerequisites for Production
1. MongoDB database (MongoDB Atlas recommended)
2. Domain with HTTPS
3. Environment variables configured

### Deploy Steps
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Create a .env.local or .env file and put these  production environment variables**
   ```env
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=production-secret
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=secure-production-password
   ```

3. **Deploy to your platform** (Vercel, Netlify, etc.)

## Security Features

- **Environment variables**: Sensitive data stored securely
- **Input validation**: Mongoose schema validation
- **SQL injection protection**: MongoDB with parameterized queries
- **Authentication**: Protected admin routes
- **Error handling**: Secure error messages

## Future Enhancements

- **Multi-user support**: Role-based permissions
- **Image uploads**: File storage integration
- **Comments system**: Reader engagement
- **Categories/Tags**: Better content organization
- **Analytics**: View tracking and insights
- **Email notifications**: Comment and post alerts
- **Social sharing**: Built-in sharing buttons
- **RSS feeds**: Content syndication

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.