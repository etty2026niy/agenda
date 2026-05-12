// Layout management for protected pages
// Handles session protection, theme toggle, and sidebar signout

// Apply theme immediately to prevent flash of wrong theme
(function() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const htmlElement = document.documentElement;

  if (savedTheme === "dark") {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
  }
})();

function initializeLayout() {
  console.log("Initializing layout...");

  console.log("Initializing layout features");

  // Initialize dark mode toggle on all pages
  initializeDarkModeToggle();

  // 3. Add signout button to sidebar
  addSignoutButton();

  // 4. Load and display user info
  loadUserInfo();

  // 5. Initialize task management if available
  if (typeof initializeTaskManagement === "function") {
    initializeTaskManagement();
  }
}

function initializeDarkModeToggle() {
  const darkModeControl = document.querySelector(
    '[data-icon="dark_mode"], [data-icon="light_mode"]',
  );
  const htmlElement = document.documentElement;

  if (!darkModeControl) return;

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  const updateControlTitle = (theme) => {
    darkModeControl.title = theme === "dark" ? "Light Mode" : "Dark Mode";
  };

  const toggleTheme = () => {
    const currentTheme = htmlElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    updateControlTitle(newTheme);
  };

  updateControlTitle(savedTheme);

  darkModeControl.addEventListener("click", toggleTheme);
  darkModeControl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  });
}

function applyTheme(theme) {
  const htmlElement = document.documentElement;
  const darkModeIcon = document.querySelector(
    '[data-icon="dark_mode"], [data-icon="light_mode"]',
  );

  if (theme === "dark") {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
    if (darkModeIcon) {
      darkModeIcon.textContent = "light_mode";
      darkModeIcon.setAttribute("data-icon", "light_mode");
    }
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
    if (darkModeIcon) {
      darkModeIcon.textContent = "dark_mode";
      darkModeIcon.setAttribute("data-icon", "dark_mode");
    }
  }
}

function addSignoutButton() {
  const sidebar = document.querySelector("aside");
  if (!sidebar) return;

  // Find the "New Entry" button more reliably
  const newEntryButton = Array.from(sidebar.querySelectorAll("button")).find(
    (btn) =>
      btn.textContent.includes("New Entry") ||
      btn.querySelector('[data-icon="add"]'),
  );

  if (!newEntryButton) return;

  // Check if signout button already exists
  if (sidebar.querySelector('[data-icon="logout"]')) return;

  // Create signout button
  const signoutButton = document.createElement("button");
  signoutButton.className =
    "w-full bg-error text-on-error py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 duration-150 shadow-sm hover:bg-red-700 transition-colors mt-3";
  signoutButton.innerHTML = `
    <span class="material-symbols-outlined text-sm" data-icon="logout">logout</span>
    Sign Out
  `;

  signoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  });

  // Insert after the "New Entry" button
  newEntryButton.parentElement.appendChild(signoutButton);
}

function loadUserInfo() {
  const user = getUserInfo();
  if (!user) return;

  // Update greeting with user's name
  const greetingElement = document.querySelector("h2");
  if (greetingElement && greetingElement.textContent.includes("Hello")) {
    const firstName = user.full_name?.split(" ")[0] || user.username;
    greetingElement.textContent = `Hello, ${firstName}!`;
  }

  // Update user avatar tooltip or display name if needed
  const userAvatar = document.querySelector('img[alt="User avatar"]');
  if (userAvatar) {
    userAvatar.title = user.username;
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", initializeLayout);
