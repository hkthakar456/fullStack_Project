import { Navigate, Outlet } from "react-router";
import useAuthStore from "../features/auth/useAuthStore";

function ProtectedRoute() {
  const authStatus = useAuthStore(
    (state) => state.authStatus
  );

  console.log("ProtectedRoute rendered");
  console.log("Auth status:", authStatus);

  if (authStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;