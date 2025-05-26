import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext"; // Adjust the path as needed

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Check if the user is authenticated

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/signIn" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
