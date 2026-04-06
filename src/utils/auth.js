import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  // For mock tokens, get role from localStorage
  if (token.startsWith('mock-token-')) {
    try {
      return localStorage.getItem('role') || 'client';
    } catch {
      return 'client';
    }
  }
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // "admin" or "client"
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

export const isAdmin = () => {
  return getUserRole() === "admin";
};

export const isClient = () => {
  return getUserRole() === "client";
};

export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  // For mock tokens, get info from localStorage
  if (token.startsWith('mock-token-')) {
    try {
      return {
        role: localStorage.getItem('role') || 'client',
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@company.com',
        userId: 'mock-user-id',
        exp: Date.now() / 1000 + 3600 // Mock expiration (1 hour from now)
      };
    } catch {
      return null;
    }
  }
  
  try {
    const decoded = jwtDecode(token);
    return {
      role: decoded.role,
      name: decoded.name || 'User',
      email: decoded.email || 'user@company.com',
      userId: decoded.userId || decoded.id,
      exp: decoded.exp
    };
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  
  // For mock tokens, don't check expiration
  if (token.startsWith('mock-token-')) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    // For mock tokens, return false (not expired)
    return token.startsWith('mock-token-') ? false : true;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  
  // Direct redirect without delay
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  // For mock tokens, just check if token exists
  if (token.startsWith('mock-token-')) {
    return true;
  }
  
  // For real JWT tokens, check if token is expired
  if (isTokenExpired()) {
    logout();
    return false;
  }
  
  return true;
};
