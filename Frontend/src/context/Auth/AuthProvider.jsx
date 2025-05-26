import { useState } from "react";
import { AuthContext } from "./AuthContext";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const getUserFromLocalStorage = () => {
    const token = localStorage.getItem("authToken");
    const storedUserEmail = localStorage.getItem("authEmail");
    return token && storedUserEmail ? { email: storedUserEmail, token } : null;
  };

  // Initialize authentication state from localStorage
  const getAuthStatusFromLocalStorage = () => !!localStorage.getItem("authToken");

  const [user, setUser] = useState(getUserFromLocalStorage);
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthStatusFromLocalStorage);

  // Login function
  const login = (userData) => {
    const { email, token } = userData;

    // Save user data in state
    setUser({ email, token });
    setIsAuthenticated(true);
    // Save token and email in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("authEmail", email);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Remove token and email from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authEmail");
  };

  // Context value to share across the app
  const value = {
    user, // Contains { email, token }
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
