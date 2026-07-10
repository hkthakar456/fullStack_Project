import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { loginUser } from "../../features/auth/authApi";
import useAuthStore from "../../features/auth/useAuthStore";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      const user = response.data.user;

      setAuthenticated(user);

      queryClient.setQueryData(["currentUser"], {
        success: true,
        data: user,
      });

      navigate("/");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      setErrorMessage(message);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");

    const identifier = formData.identifier.trim();

    const credentials = identifier.includes("@")
      ? {
          email: identifier,
          password: formData.password,
        }
      : {
          userName: identifier,
          password: formData.password,
        };

    loginMutation.mutate(credentials);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>

        <p className="login-subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>

            <input
              id="identifier"
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button
            className="login-button"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
