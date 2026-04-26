import { apiFetch } from "../utils/apiFetch";

const BASE_URL = "http://localhost:8080";

export const client = {
  get: (url: string) => apiFetch(BASE_URL + url).then(r => r.json()),
  post: (url: string, body: any) =>
    apiFetch(BASE_URL + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(r => r.json()),
  put: (url: string, body: any) =>
    apiFetch(BASE_URL + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(r => r.json()),
  del: (url: string) =>
    apiFetch(BASE_URL + url, { method: "DELETE" }),
};