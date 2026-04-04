const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("grid_token");
}

function buildHeaders(customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(),
  });
  return handleResponse(response);
}

export async function apiPost(path, body = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function apiPut(path, body = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function apiDelete(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });
  return handleResponse(response);
}

export const authApi = {
  login: (username, password) => apiPost("/auth/login", { username, password }),
  me: () => apiGet("/auth/me"),
};

export const challengeApi = {
  list: () => apiGet("/challenges"),
  submitFlag: (challengeId, flag) =>
    apiPost(`/challenges/${challengeId}/submit`, { flag }),
};

export const scoreboardApi = {
  list: () => apiGet("/scoreboard"),
};

export const teamsApi = {
  list: () => apiGet("/teams"),
  bySlug: (slug) => apiGet(`/teams/${slug}`),
};

export const adminApi = {
  stats: () => apiGet("/admin/stats"),
  listChallenges: () => apiGet("/admin/challenges"),
  createChallenge: (payload) => apiPost("/admin/challenges", payload),
  updateChallenge: (id, payload) => apiPut(`/admin/challenges/${id}`, payload),
  deleteChallenge: (id) => apiDelete(`/admin/challenges/${id}`),
};

export function persistToken(token) {
  localStorage.setItem("grid_token", token);
}

export function clearToken() {
  localStorage.removeItem("grid_token");
}
