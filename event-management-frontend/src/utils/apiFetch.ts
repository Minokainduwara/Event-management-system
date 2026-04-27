export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    console.warn("Unauthorized request");
  }

  return response;
};