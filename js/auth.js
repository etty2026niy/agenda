const API_BASE_URL = "http://localhost:4000";
const TOKEN_KEY = "agenda_pro_token";

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isAuthenticated() {
  return !!getToken();
}

function signOut() {
  clearToken();
  localStorage.removeItem("user_info");
}

function getUserInfo() {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
}

function setUserInfo(user) {
  localStorage.setItem("user_info", JSON.stringify(user));
}

function ensureAuthenticated() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}

function getApiUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

function authFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(getApiUrl(path), {
    ...options,
    headers,
  });
}

async function handleResponse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // response body may not be JSON if the backend is unreachable or returns an HTML error page
  }

  if (!response.ok) {
    const error =
      data?.message || response.statusText || "Authentication failed.";
    throw new Error(error);
  }

  return data;
}

async function loginUser(email, password) {
  const response = await fetch(getApiUrl("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

async function registerUser(values) {
  const response = await fetch(getApiUrl("/api/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  return handleResponse(response);
}

function redirectToDashboard() {
  window.location.href = "dashboard.html";
}

function redirectToLogin() {
  window.location.href = "login.html";
}

function showMessage(message, type = "error") {
  const messageBox = document.getElementById("authMessage");
  if (!messageBox) return;
  messageBox.textContent = message;
  messageBox.classList.remove("invisible", "text-red-600", "text-green-600");
  messageBox.classList.add(
    type === "success" ? "text-green-600" : "text-red-600",
  );
}

function clearMessage() {
  const messageBox = document.getElementById("authMessage");
  if (!messageBox) return;
  messageBox.classList.add("invisible");
  messageBox.textContent = "";
}

function attachAuthFormHandlers() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    if (isAuthenticated()) {
      redirectToDashboard();
      return;
    }

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      try {
        const data = await loginUser(email, password);
        setToken(data.token);
        setUserInfo(data.user);
        showMessage("Login successful! Redirecting...", "success");
        setTimeout(redirectToDashboard, 800);
      } catch (error) {
        showMessage(error.message || "Login failed.");
      }
    });
  }

  if (registerForm) {
    if (isAuthenticated()) {
      redirectToDashboard();
      return;
    }

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessage();
      const username = document.getElementById("registerUsername").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value;
      const full_name = document
        .getElementById("registerFullName")
        .value.trim();

      try {
        const data = await registerUser({
          username,
          email,
          password,
          full_name,
        });
        setToken(data.token);
        setUserInfo(data.user);
        showMessage("Registration successful! Redirecting...", "success");
        setTimeout(redirectToDashboard, 800);
      } catch (error) {
        showMessage(error.message || "Registration failed.");
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", attachAuthFormHandlers);
