import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}
