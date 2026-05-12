// Task Management API functions
const API_BASE_URL = "http://localhost:4000";

function getTasks() {
  return fetch(`${API_BASE_URL}/api/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication failed (${response.status})`);
    }
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  });
}

function createTask(taskData) {
  return fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  }).then((response) => {
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Authentication failed (${response.status})`);
    }
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return response.json();
  });
}

function updateTask(taskId, taskData) {
  return fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return response.json();
  });
}

function deleteTask(taskId) {
  return fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return response.json();
  });
}

// Task rendering functions
function createTaskElement(task) {
  const priorityColors = {
    high: "error-container text-on-error-container",
    medium: "secondary-container text-on-secondary-container",
    low: "surface-container-highest text-on-surface-variant",
  };

  const statusIcons = {
    pending: "radio_button_unchecked",
    completed: "check_circle",
  };

  const statusClasses = {
    pending: "text-outline group-hover:text-primary",
    completed: "text-secondary",
  };

  const isCompleted = task.status === "completed";
  const priorityBadge = task.priority.toUpperCase();
  const dueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString()
    : "No due date";

  return `
    <div class="task-item bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-primary dark:hover:border-blue-400 transition-all" data-task-id="${task.id}">
      <div class="flex items-start gap-3">
        <button class="task-status-btn flex-shrink-0 mt-1 ${statusClasses[task.status]}" data-task-id="${task.id}" data-status="${task.status}">
          <span class="material-symbols-outlined ${isCompleted ? "fill-1" : ""}" data-icon="${statusIcons[task.status]}">${statusIcons[task.status]}</span>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4 class="task-title font-semibold text-on-surface dark:text-gray-100 ${isCompleted ? "line-through decoration-outline" : ""} break-words">
              ${task.title}
            </h4>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="bg-${priorityColors[task.priority]} text-[10px] px-2 py-1 rounded-full font-bold">
                ${priorityBadge}
              </span>
              <button class="task-edit-btn opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" data-task-id="${task.id}">
                <span class="material-symbols-outlined text-sm" data-icon="edit">edit</span>
              </button>
              <button class="task-delete-btn opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded" data-task-id="${task.id}">
                <span class="material-symbols-outlined text-sm text-red-500" data-icon="delete">delete</span>
              </button>
            </div>
          </div>

          ${task.description ? `<p class="task-description text-sm text-on-surface-variant dark:text-gray-300 mt-2 break-words">${task.description}</p>` : ""}

          <div class="flex items-center justify-between mt-3 text-xs text-on-surface-variant dark:text-gray-400">
            <span class="task-due-date">
              ${task.category ? `<span class="font-medium">${task.category}</span> • ` : ""}
              Due: ${dueDate}
            </span>
            <span class="task-created">
              Created: ${new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createDashboardTaskElement(task) {
  const isCompleted = task.status === "completed";
  const statusIcon = isCompleted ? "check_circle" : "radio_button_unchecked";
  const statusClass = isCompleted
    ? "text-secondary"
    : "text-outline group-hover:text-primary";
  const titleClass = isCompleted ? "line-through decoration-outline" : "";
  const dueTime = task.due_date
    ? new Date(task.due_date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const priorityText =
    task.priority === "high"
      ? "High Priority"
      : task.priority === "medium"
        ? "Medium Priority"
        : "Low Priority";

  return `
    <div class="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-slate-100 group hover:border-primary transition-all">
      <span class="material-symbols-outlined ${statusClass} ${isCompleted ? "fill-1" : ""}" data-icon="${statusIcon}">${statusIcon}</span>
      <div class="flex-1">
        <h5 class="font-bold text-on-surface ${titleClass}">${task.title}</h5>
        <p class="text-xs text-on-surface-variant">
          ${dueTime ? `Due by ${dueTime} • ` : ""}${priorityText}
        </p>
      </div>
      <span class="bg-${task.priority === "high" ? "error-container text-on-error-container" : task.priority === "medium" ? "secondary-container text-on-secondary-container" : "surface-container-highest text-on-surface-variant"} text-[10px] px-2 py-1 rounded-full font-bold">
        ${task.priority.toUpperCase()}
      </span>
    </div>
  `;
}

// Task management functions
function loadTasks() {
  const taskList = document.getElementById("task-list");
  if (!taskList) return;

  taskList.innerHTML =
    '<div class="text-center py-8 text-on-surface-variant">Loading tasks...</div>';

  getTasks()
    .then((data) => {
      if (data.tasks && data.tasks.length > 0) {
        taskList.innerHTML = data.tasks
          .map((task) => createTaskElement(task))
          .join("");
        attachTaskEventListeners();
      } else {
        taskList.innerHTML =
          '<div class="text-center py-8 text-on-surface-variant">No tasks found. Create your first task!</div>';
      }
      updateTaskStats(data.tasks || []);
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
      if (error.message.includes("Authentication failed")) {
        taskList.innerHTML =
          '<div class="text-center py-8 text-red-500">Please log in to view your tasks.</div>';
      } else {
        taskList.innerHTML =
          '<div class="text-center py-8 text-red-500">Failed to load tasks. Please try again.</div>';
      }
    });
}

function loadDashboardTasks() {
  const taskContainer =
    document.getElementById("dashboard-task-container") ||
    document.querySelector(".space-y-4");
  const totalTasksEl = document.getElementById("dashboard-total-tasks");

  if (!taskContainer) return;

  getTasks()
    .then((data) => {
      const tasks = data.tasks || [];

      // Update total tasks count on dashboard
      if (totalTasksEl) {
        totalTasksEl.textContent = tasks.length;
      }

      // Show only pending tasks for dashboard, limit to 3
      const pendingTasks = tasks
        .filter((task) => task.status === "pending")
        .slice(0, 3);

      if (pendingTasks.length > 0) {
        taskContainer.innerHTML = pendingTasks
          .map((task) => createDashboardTaskElement(task))
          .join("");
      } else {
        taskContainer.innerHTML =
          '<div class="text-center py-8 text-on-surface-variant">No pending tasks for today!</div>';
      }
    })
    .catch((error) => {
      console.error("Error loading dashboard tasks:", error);
      if (taskContainer) {
        taskContainer.innerHTML =
          '<div class="text-center py-8 text-red-500">Failed to load tasks.</div>';
      }
    });
}

function updateTaskStats(tasks) {
  const totalTasksEl = document.getElementById("total-tasks");
  const completedTasksEl = document.getElementById("completed-tasks");
  const pendingTasksEl = document.getElementById("pending-tasks");

  if (totalTasksEl) totalTasksEl.textContent = tasks.length;
  if (completedTasksEl)
    completedTasksEl.textContent = tasks.filter(
      (t) => t.status === "completed",
    ).length;
  if (pendingTasksEl)
    pendingTasksEl.textContent = tasks.filter(
      (t) => t.status === "pending",
    ).length;
}

function attachTaskEventListeners() {
  // Status toggle buttons
  document.querySelectorAll(".task-status-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const taskId = this.dataset.taskId;
      const currentStatus = this.dataset.status;
      const newStatus = currentStatus === "pending" ? "completed" : "pending";

      updateTask(taskId, { status: newStatus })
        .then(() => {
          loadTasks(); // Reload tasks to reflect changes
        })
        .catch((error) => {
          console.error("Error updating task status:", error);
          alert("Failed to update task status. Please try again.");
        });
    });
  });

  // Edit buttons
  document.querySelectorAll(".task-edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const taskId = this.dataset.taskId;
      // TODO: Implement edit functionality
      alert("Edit functionality coming soon!");
    });
  });

  // Delete buttons
  document.querySelectorAll(".task-delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const taskId = this.dataset.taskId;
      if (confirm("Are you sure you want to delete this task?")) {
        deleteTask(taskId)
          .then(() => {
            loadTasks(); // Reload tasks to reflect changes
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
          });
      }
    });
  });
}

// Form handling
function handleTaskFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const taskData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority") || "medium",
    category: formData.get("category"),
    due_date: formData.get("due_date"),
    status: "pending",
  };

  createTask(taskData)
    .then(() => {
      event.target.reset();
      loadTasks(); // Reload tasks to show the new one

      const feedback = document.getElementById("task-feedback");
      if (feedback) {
        feedback.textContent = "Task created successfully.";
        feedback.classList.remove("hidden", "text-red-500");
        feedback.classList.add("text-green-600");
        setTimeout(() => {
          feedback.classList.add("hidden");
        }, 3000);
      }

      const formContainer = document.querySelector(".fixed.right-0");
      if (formContainer) {
        formContainer.classList.add("hidden");
      }
    })
    .catch((error) => {
      console.error("Error creating task:", error);
      const feedback = document.getElementById("task-feedback");
      if (feedback) {
        feedback.textContent = error.message.includes("Authentication failed")
          ? "Please log in to create tasks."
          : "Failed to create task. Please try again.";
        feedback.classList.remove("hidden", "text-green-600");
        feedback.classList.add("text-red-500");
      }
      if (error.message.includes("Authentication failed")) {
        alert("Please log in to create tasks.");
      }
    });
}

// Initialize task management
function initializeTaskManagement() {
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");
  const dashboardTaskContainer = document.getElementById(
    "dashboard-task-container",
  );

  if (taskForm) {
    taskForm.addEventListener("submit", handleTaskFormSubmit);
  }

  if (taskList) {
    loadTasks();
  }

  if (dashboardTaskContainer) {
    loadDashboardTasks();
  }
}

// Helper function to get token (assuming it's defined in auth.js)
function getToken() {
  return localStorage.getItem("agenda_pro_token");
}

document.addEventListener("DOMContentLoaded", initializeTaskManagement);
