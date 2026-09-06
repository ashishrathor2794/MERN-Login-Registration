const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mern-login-registration-backend.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const registerUser = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const loginUser = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const logoutUser = () =>
  request("/auth/logout", {
    method: "POST"
  });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });

export const resetPassword = (payload) =>
  request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const getCurrentUser = () =>
  request("/auth/me");