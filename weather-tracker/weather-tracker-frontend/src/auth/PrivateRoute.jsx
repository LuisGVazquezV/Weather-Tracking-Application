import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            toast.warning("Sorry, you need to be logged in to access this page.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [currentUser]);

    return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
// This code defines a PrivateRoute component that checks if a user is authenticated before allowing access to certain routes.
// If the user is not authenticated, they are redirected to the login page.
// The useAuth hook is used to get the current user's authentication status.
// The component uses React Router's Navigate component to handle the redirection.