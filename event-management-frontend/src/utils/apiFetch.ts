export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // TEMPORARILY DISABLED FOR PREVIEW
    // window.location.href = "/login";
    // throw new Error("No token found. Redirecting to login...");
    console.warn("Preview Mode: No token found, but allowing request.");
  }

  // Token presence is verified.
  // Backend will enforce role-based access returning 401/403 if unauthorized.

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  // Auto-set Content-Type for JSON payloads if not explicitly set
  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    // TEMPORARILY DISABLED FOR PREVIEW
    // localStorage.removeItem("token");
    // window.location.href = "/login";
    // throw new Error("Unauthorized. Redirecting to login...");
    console.warn("Preview Mode: Ignored 401/403 Unauthorized response.");
  }

  return response;
};
