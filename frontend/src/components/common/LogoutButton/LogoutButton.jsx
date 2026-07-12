import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logoutUser } from "../../../features/auth/authApi";
import useAuthStore from "../../../features/auth/useAuthStore";

import "./LogoutButton.css";

function LogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      setUnauthenticated();

      queryClient.removeQueries({
        queryKey: ["currentUser"],
      });

      navigate("/login", {
        replace: true,
      });
    },

    onError: (error) => {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message,
      );
    },
  });

  return (
    <button
      className="logout-menu-button"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutButton;
