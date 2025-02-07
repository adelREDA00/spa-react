import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <ClipLoader className="mb-4" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />; // Redirects unauthenticated users
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />; // Redirects non-admin users
  }

  return children;
};

export default ProtectedRoute;
