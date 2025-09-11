import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./lib/context/user";

// Pages and Components
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Dashboard from "./components/drive/Dashboard";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import Navbar from "./components/drive/Navbar";
import ResetPassword from "./components/auth/ResetPassword";

// Loading fallback (optional)
function Loading() {
  return <div className="text-center p-5">Loading...</div>;
}

// ✅ PrivateRoute wrapper for v6
function PrivateRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/folder/:folderId"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="text-center p-5">
                <h2>404 - Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}
