import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { registerUser } from "../../features/auth/authApi";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

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

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatar(file);

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverImage(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!avatar) {
      setErrorMessage("Avatar is required.");
      return;
    }

    const registrationData = new FormData();

    registrationData.append(
      "fullName",
      formData.fullName.trim()
    );

    registrationData.append(
      "userName",
      formData.userName.trim()
    );

    registrationData.append(
      "email",
      formData.email.trim()
    );

    registrationData.append(
      "password",
      formData.password
    );

    registrationData.append(
      "avatar",
      avatar
    );

    if (coverImage) {
      registrationData.append(
        "coverImage",
        coverImage
      );
    }

    registerMutation.mutate(registrationData);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>

          <p>
            Create your account to upload, follow creators,
            and build your watch history.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="cover-upload-section">
            <button
              type="button"
              className="cover-preview"
              onClick={() =>
                coverInputRef.current?.click()
              }
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                />
              ) : (
                <span>
                  Add Cover Image (Optional)
                </span>
              )}
            </button>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              hidden
            />
          </div>

          <div className="avatar-upload-section">
            <button
              type="button"
              className="avatar-preview"
              onClick={() =>
                avatarInputRef.current?.click()
              }
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                />
              ) : (
                <span>+</span>
              )}
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />

            <div>
              <p className="avatar-label">
                Profile Picture
              </p>

              <p className="avatar-help">
                Avatar is required
              </p>
            </div>
          </div>

          <div className="register-fields-grid">
            <div className="register-form-group">
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="userName">
                Username
              </label>

              <input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="register-form-group register-full-width">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter password again"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <p className="register-error">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="register-submit-button"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p className="register-login-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;