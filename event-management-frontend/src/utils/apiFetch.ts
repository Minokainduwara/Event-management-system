export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  // Set JSON header automatically when body exists
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token only if available
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle authentication failures
  if (response.status === 401 || response.status === 403) {
    console.warn("Unauthorized access - clearing session");

    localStorage.removeItem("token");

    // Optional redirect (enable in real app)
    // window.location.href = "/login";
  }

  // Handle non-success responses properly
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `HTTP Error: ${response.status}`);
  }

  return response;
};