// Shared behaviour for all pages. No server is needed.
(function () {
  const root = document.documentElement;

  // Theme: keep the choice in localStorage when the browser allows it.
  function readTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem("theme", value); } catch (e) { /* ignore */ }
  }

  const saved = readTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");

  const themeBtn = document.querySelector("#theme-toggle");
  function updateThemeIcon() {
    themeBtn.textContent = root.dataset.theme === "dark" ? "☀" : "☾";
    themeBtn.setAttribute("aria-label", root.dataset.theme === "dark" ? "切換為淺色模式" : "切換為深色模式");
  }
  updateThemeIcon();
  themeBtn.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    saveTheme(root.dataset.theme);
    updateThemeIcon();
  });

  // Mobile menu.
  const menuBtn = document.querySelector("#menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  menuBtn.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  // Mark the link of the current page.
  const page = location.pathname.split("/").pop() || "index.html";
  navLinks.querySelectorAll("a").forEach(function (link) {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Footer year.
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Resume page: fill skill bars.
  document.querySelectorAll(".bar span[data-level]").forEach(function (bar) {
    requestAnimationFrame(function () { bar.style.width = bar.dataset.level + "%"; });
  });

  // Projects page: filter cards by tag.
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tag = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      projects.forEach(function (card) {
        card.hidden = tag !== "all" && !card.dataset.tags.split(" ").includes(tag);
      });
    });
  });

  // Contact form: no backend, so show a local message only.
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = form.elements.name.value.trim();
      document.querySelector("#form-status").textContent =
        "謝謝 " + name + "！這是雛形，訊息沒有送出。";
      form.reset();
    });
  }
})();
