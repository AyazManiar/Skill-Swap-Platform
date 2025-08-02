import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router";
import { toastError } from "../lib/useToast";

const ProtectedRoute = ({ children, restrictedRoles = [] }) => {
    const { auth } = useContext(AuthContext) || {};
    const isLoggedIn = auth?.isLoggedIn;
    const userRole = auth?.role ?? "";

    if (!isLoggedIn) {
        return (
            <>
                <Navigate to="/login" replace />
                {toastError("You must be logged in to access this page")}
            </>
        );
    }

    if (restrictedRoles.includes(userRole)) {
        return (
            <>
                <Navigate to="/" replace />
                {toastError("You do not have permission to access this page")}
            </>
        );
    }

    return children;
};

export default ProtectedRoute;
