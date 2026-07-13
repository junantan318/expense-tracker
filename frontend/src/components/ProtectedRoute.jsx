import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Please log in to continue.",
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;