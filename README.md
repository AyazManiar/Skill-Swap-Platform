# 🔄 Skill-Swap-Platform

A modern, full-stack social platform that connects people to share and exchange skills. Built with the MERN stack, this application enables users to teach and learn from each other in a structured, feedback-driven environment.

## 🌟 Features

### 🔄 **Skill Swapping**
- **Request Creation** - Create detailed skill exchange requests with notes
- **Swap Management** - Accept, reject, or cancel pending requests
- **Status Tracking** - Complete lifecycle from pending to completion
- **Organized Views** - Tabbed interface for ongoing, outgoing, incoming, and completed swaps

### 👤 **User Management**
- **Secure Authentication** - JWT-based login/signup with password strength validation
- **Profile Customization** - Add bio, skills offered, skills wanted, and availability
- **Privacy Controls** - Toggle between public and private profile visibility
- **User Discovery** - Browse and search users by skills and availability filters

### 🤝 **Friend System**
- **Friend Requests** - Send, accept, reject, and cancel friend requests
- **Friend Management** - Organized tabbed interface for managing connections
- **Social Networking** - Build your professional learning network

### ⭐ **Feedback & Ratings**
- **5-Star Rating System** - Rate completed skill exchanges with comments
- **Profile Ratings** - Aggregate ratings displayed on user profiles
- **Feedback History** - View given and received feedback
- **Quality Assurance** - Only completed swaps are eligible for feedback

### 📱 **User Experience**
- **Responsive Design** - Mobile-first approach with clean, modern UI
- **Real-time Notifications** - Toast notifications for user actions
- **Interactive Components** - Modal dialogs, tabbed interfaces, and smooth transitions

## 🛠️ Technology Stack

### **Frontend**
- **React 19.1.0** - Modern React with hooks and context API
- **Vite 7.0.4** - Fast development and build tool
- **React Router 7.6.3** - Client-side routing with protected routes
- **React Hook Form** - Form validation and management
- **React Toastify** - User notifications
- **Custom CSS** - Responsive styling with modern layouts

### **Backend**
- **Node.js & Express 5.1.0** - Server framework
- **MongoDB & Mongoose 8.16.3** - Database and ODM
- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin request handling

## 📚 API Documentation

### **Authentication Routes** (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /checkLoggedIn` - Verify authentication status

### **User Routes** (`/api/users`)
- `GET /visible` - Browse users with availability filters
- `GET /me` - Get current user profile
- `GET /:username` - Get user by username
- `PUT /updateProfile` - Update user profile
- `GET /friends` - Get friends list
- `GET /friend-requests/incoming` - Get incoming friend requests
- `GET /friend-requests/outgoing` - Get outgoing friend requests
- `POST /sendFriendRequest` - Send friend request
- `POST /acceptFriendRequest` - Accept friend request
- `POST /rejectFriendRequest` - Reject friend request
- `POST /cancelFriendRequest` - Cancel sent friend request
- `DELETE /removeFriend` - Remove friend

### **Swap Request Routes** (`/api/swapRequests`)
- `POST /create` - Create new swap request
- `GET /` - Get all swap requests for user
- `PUT /:id/accept` - Accept swap request
- `PUT /:id/reject` - Reject swap request
- `PUT /:id/cancel` - Cancel swap request
- `PUT /:id/complete` - Mark swap as completed

### **Feedback Routes** (`/api/feedback`)
- `POST /create` - Create feedback for completed swap
- `GET /check/:swapRequestId` - Check if feedback was given
- `GET /` - Get all user's feedback


## 🔐 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** using bcryptjs
- **Input Validation** on both client and server
- **Protected Routes** with role-based access control
- **CORS Configuration** for secure cross-origin requests
- **SQL Injection Protection** via Mongoose ODM

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern Interface** - Clean, intuitive user experience
- **Interactive Components** - Smooth animations and transitions
- **Accessibility** - ARIA labels and keyboard navigation
- **Toast Notifications** - Real-time user feedback
- **Modal Dialogs** - Contextual actions and forms
- **Tabbed Interfaces** - Organized content presentation


## 👨‍💻 Author

**Ayaz Maniar**
- GitHub: [@AyazManiar](https://github.com/AyazManiar)


*Built with ❤️ using the MERN stack*
