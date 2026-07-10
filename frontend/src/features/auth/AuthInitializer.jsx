import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, refreshAccessToken } from "./authApi";

import useAuthStore from "./useAuthStore";

async function initializeAuth() {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error.response?.status !== 401) {
      throw error;
    }

    await refreshAccessToken();

    return await getCurrentUser();
  }
}

function AuthInitializer({ children }) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: initializeAuth,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setAuthenticated(data.data);
    }

    if (isError) {
      setUnauthenticated();
    }
  }, [isSuccess, isError, data, setAuthenticated, setUnauthenticated]);

  return children;
}

export default AuthInitializer;
