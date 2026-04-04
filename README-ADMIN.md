# TAX NEXUS Admin Panel

A professional React-based admin panel for managing the TAX NEXUS FBR E-Invoicing system.

## 🚀 Features

- **Admin Authentication**: Secure JWT-based login system
- **Company Management**: Create and manage companies with FBR integration
- **User Management**: Add users to companies with role-based access
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **API Integration**: Full REST API integration with error handling
- **Protected Routes**: Role-based access control
- **Real-time Status**: Live connection indicators and activity monitoring

## 📁 File Structure

```
src/
├── pages/admin/
│   ├── AdminLogin.jsx          # Admin login page
│   ├── Dashboard.jsx           # Admin dashboard with stats
│   ├── CreateCompany.jsx       # Create company form
│   ├── CreateUser.jsx          # Create user form
│   ├── AdminLayout.jsx         # Admin layout wrapper
│   └── AdminProtectedRoute.jsx # Route protection
├── components/admin/
│   ├── Sidebar.jsx             # Admin navigation sidebar
│   └── Navbar.jsx              # Admin top navigation
├── services/
│   └── api.js                  # API service with axios
├── AdminApp.jsx                # Main admin app component
└── admin.css                   # Custom admin styles
```

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **JWT Authentication** - Secure token-based auth

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react@18.2.0 react-dom@18.2.0 react-router-dom@6.8.0 axios@1.3.0
```

### 2. Development Server

```bash
# Using Vite (recommended)
npm run dev:admin

# Or using the custom script
npm run admin
```

The admin panel will be available at: `http://localhost:3001`

### 3. Build for Production

```bash
npm run build:admin
```

## 🔐 Authentication

The admin panel uses JWT tokens for authentication:

1. **Login**: `POST /api/admin/login`
   ```json
   {
     "email": "admin@taxnexus.com",
     "password": "admin123"
   }
   ```

2. **Token Storage**: JWT token stored in `localStorage` as `adminToken`

3. **Auto-logout**: 401 responses automatically redirect to login

## 📡 API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/company` - Create company
- `GET /api/admin/companies` - List companies
- `POST /api/admin/create-user` - Create user
- `GET /api/admin/users` - List users
- `GET /api/admin/stats` - Dashboard statistics

### Client Endpoints
- `POST /api/client/login` - Client login
- `GET /api/client/invoices` - Get invoices
- `POST /api/client/invoice` - Create invoice

## 🎨 UI Components

### Sidebar Navigation
- Dashboard overview
- Company management
- User management
- Active route highlighting

### Dashboard Features
- Statistics cards (companies, users, invoices, API calls)
- Quick action buttons
- Recent activity feed
- Responsive grid layout

### Forms
- Company creation with validation
- User creation with company selection
- Error handling and success messages
- Loading states

## 🔒 Security Features

- **Protected Routes**: All admin routes require authentication
- **Token Interceptors**: Automatic token attachment and refresh
- **Role-based Access**: Admin-only routes
- **Error Handling**: Comprehensive error management

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for all screen sizes

## 🔄 State Management

- React hooks for local state
- localStorage for token persistence
- Axios interceptors for API calls
- Form validation and error handling

## 🎯 Key Features

### Multi-tenant Architecture
- Separate admin and client access
- Company-based user isolation
- Role-based permissions

### FBR Integration
- API token management
- Sandbox/Production environments
- Province-based configuration

### Modern UX
- Loading indicators
- Success/error notifications
- Smooth transitions
- Professional styling

## 🐛 Error Handling

- API error responses with user-friendly messages
- Network error handling
- Form validation errors
- Authentication failures

## 📊 Monitoring

- Real-time connection status
- Activity tracking
- API call statistics
- User engagement metrics

## 🚀 Deployment

### Development
```bash
npm run dev:admin
```

### Production
```bash
npm run build:admin
```

### Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_ADMIN_PORT=3001
```

## 📝 Notes

- The admin panel runs on port 3001 to avoid conflicts with the main app
- All API calls include JWT authentication
- Forms include comprehensive validation
- Responsive design works on all devices
- Error handling provides user feedback

## 🤝 Contributing

1. Follow React best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Test authentication flows
5. Maintain responsive design

## 📞 Support

For issues and questions:
- Check API endpoints
- Verify JWT tokens
- Test authentication flow
- Review console errors
