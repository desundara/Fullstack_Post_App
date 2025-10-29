import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);

    // ✅ loading period blank return
    if (authState.loading) return null;

    // ✅ If unauthenticated redirect login page
    if (!authState.status) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
