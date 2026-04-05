import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
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
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  // Check if token is expired
  if (isTokenExpired()) {
    logout();
    return false;
  }
  
  return true;
};
