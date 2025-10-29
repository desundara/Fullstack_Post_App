import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);

    // loading eka check karanna epa nam first render eken redirect wenawa
    if (authState.loading) return null; // or loader component

    return authState.status ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
