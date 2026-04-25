import ky from "ky";

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
});

export const apiFetch = async (url:string, options:RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/users${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("API Error: " + response.status);
  }

  return response.json();
};

export default api;