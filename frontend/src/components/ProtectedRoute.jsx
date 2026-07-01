import { Navigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = authService.getToken();
  const user = authService.getUser();

  // Check if token exists and user data is valid
  if (!token || !user) {
    // Redirect to login page, keeping the attempted location for after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Validate token structure (JWT has 3 parts separated by dots)
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    authService.logout();
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Decode payload and check expiration
  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      // Token has expired
      authService.logout();
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } catch {
    // Invalid payload encoding
    authService.logout();
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}