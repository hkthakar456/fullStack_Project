import api, { publicApi } from "../../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await api.post("/users/register", formData);

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await publicApi.post("/users/refresh-token");
  return response.data;
};