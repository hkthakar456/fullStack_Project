import api, { publicApi } from "./axios";
import useAuthStore from "../features/auth/useAuthStore";

let refreshPromise = null;

export function setupInterceptors() {
  const responseInterceptor = api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      const isUnauthorized = error.response?.status === 401;

      const isRefreshRequest = originalRequest?.url?.includes(
        "/users/refresh-token",
      );

      const isAuthCheck = originalRequest?.url?.includes("/users/current-user");

      const isLoginRequest = originalRequest?.url?.includes("/users/login");

      if (
        !isUnauthorized ||
        originalRequest?._retry ||
        isRefreshRequest ||
        isAuthCheck ||
        isLoginRequest
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = publicApi
            .post("/users/refresh-token")
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return api(originalRequest);
        
      } 
      
      catch (refreshError) {
        useAuthStore.getState().setUnauthenticated();

        return Promise.reject(refreshError);
      }
    },
  );

  return responseInterceptor;
}
