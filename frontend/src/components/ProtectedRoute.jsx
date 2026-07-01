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

  // Optional: Validate token structure (basic check)
  // JWT tokens have 3 parts separated by dots
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    authService.logout();
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}