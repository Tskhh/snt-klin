// Демо-данные (работают без сервера)
const DEMO_USERS = {
  "admin@snt-klin.ru": {
    password: "admin123",
    role: "admin",
    name: "Иванов Иван Иванович",
    plot: "2",
  },
  "petrov@example.ru": {
    password: "resident123",
    role: "resident",
    name: "Петров Пётр Петрович",
    plot: "1",
    debt: 1128,
    balance: -1128,
  },
};

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("snt_session") || "null");
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem("snt_session", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("snt_session");
  window.location.href = "index.html";
}

function requireLogin(target) {
  const s = getSession();
  if (!s) {
    window.location.href = "login.html?next=" + encodeURIComponent(target || "cabinet.html");
    return null;
  }
  return s;
}

function initHeader() {
  const session = getSession();
  const loginBtn = document.getElementById("header-login");
  const cabinetBtn = document.getElementById("header-cabinet");
  const adminBtn = document.getElementById("header-admin");

  if (!loginBtn) return;

  if (session) {
    loginBtn.classList.add("hidden");
    if (cabinetBtn) {
      cabinetBtn.classList.remove("hidden");
      cabinetBtn.href = session.role === "admin" ? "admin.html" : "cabinet.html";
    }
    if (adminBtn && session.role === "admin") {
      adminBtn.classList.remove("hidden");
    }
  }
}

function handleLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const err = document.getElementById("login-error");

    const user = DEMO_USERS[email];
    if (!user || user.password !== password) {
      err.textContent = "Неверный email или пароль";
      err.style.display = "block";
      return;
    }

    setSession({
      email,
      role: user.role,
      name: user.name,
      plot: user.plot,
      debt: user.debt || 0,
      balance: user.balance || 0,
    });

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = next || "cabinet.html";
    }
  });
}

function initCabinet() {
  const session = requireLogin("cabinet.html");
  if (!session) return;

  if (session.role === "admin") {
    window.location.href = "admin.html";
    return;
  }

  const nameEl = document.getElementById("user-name");
  const plotEl = document.getElementById("user-plot");
  const debtEl = document.getElementById("debt-amount");
  const debtBox = document.getElementById("debt-box");

  if (nameEl) nameEl.textContent = session.name;
  if (plotEl) plotEl.textContent = "№ " + session.plot;
  const reqPlot = document.getElementById("requisites-plot");
  if (reqPlot) reqPlot.textContent = session.plot;

  const debt = session.debt || 0;
  if (debtEl) {
    debtEl.textContent = debt > 0 ? debt.toLocaleString("ru-RU") + " ₽" : "Нет долга";
  }
  if (debtBox) {
    if (debt <= 0) debtBox.classList.add("ok");
  }

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", logout);
  });
}

function initAdmin() {
  const session = requireLogin("admin.html");
  if (!session) return;

  if (session.role !== "admin") {
    window.location.href = "cabinet.html";
    return;
  }

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", logout);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  handleLoginForm();
  initCabinet();
  initAdmin();
});
