import ky from "ky";

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    hooks: {
        beforeRequest: [
            (request) => {
                const token = localStorage.getItem("authToken");
                if (token) {
                    request.headers.set("Authorization", `Bearer ${token}`);
                }
            },
        ],
    },
});

export default api;