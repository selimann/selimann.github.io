class ProjectManager {
  constructor() {
    this.projects = [];
  }

  async init() {
    await this.loadProjects();
    this.renderProjectGrid();
    this.setupEventListeners();
  }

  async loadProjects() {
    try {
      const response = await fetch("./data/projects.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.projects = data.projects || [];
    } catch (error) {
      console.error("Error loading projects:", error);
      this.projects = [];
    }
  }

  renderProjectGrid() {
    const grid = document.querySelector(".projects-grid");
    if (!grid) return;

    grid.innerHTML = "";

    this.projects.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const tagHTML = (proj.tags || [])
        .map((t) => `<span class="tech">${t}</span>`)
        .join(" ");

      // Если type === "external", берем ссылку из proj.link
      let href = "#";
      let attrs = "";
      if (proj.type === "external") {
        href = proj.link || "#";
        // открывать внешние ссылки в новой вкладке безопасно
        attrs = 'target="_blank" rel="noopener noreferrer"';
      } else {
        // внутренний проект — ссылка на страницу проекта
        href = `project.html?id=${encodeURIComponent(proj.id)}`;
      }

      card.innerHTML = `
        <h3>${escapeHtml(proj.title || "")}</h3>
        <p>${escapeHtml(proj.description || "")}</p>
        <div class="tags">${tagHTML}</div>
        <a href="${href}" class="view-btn" ${attrs}>View Project</a>
      `;

      grid.appendChild(card);
    });
  }

  setupEventListeners() {
    const grid = document.querySelector(".projects-grid");
    if (!grid) return;

    // Делегируем клики по кнопкам просмотра
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-btn");
      if (!btn) return;
      this.trackProjectView(btn);
      // при внешней ссылке поведение оставляем по умолчанию (открытие)
      // при внутренних можно сделать дополнительную логику, если нужно
    });
  }

  trackProjectView(linkElement) {
    console.log(`Project viewed: ${linkElement.href}`);
    // Здесь можно интегрировать analytics / gtag / fetch для логирования
  }

  addProject(project) {
    this.projects.push(project);
    this.renderProjectGrid();
  }

  getProjectByTitle(title) {
    return this.projects.find((proj) => proj.title === title);
  }
}

/* ===== HELPERS ===== */
// Небольшая защита от XSS — экранируем вставляемые строки
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ===== ИНИЦИАЛИЗАЦИЯ ===== */
document.addEventListener("DOMContentLoaded", async () => {
  // Если вы используете ProjectManager — инициализируем его.
  // Если нет — можно оставить старую логику (ниже), но лучше использовать менеджер.
  const manager = new ProjectManager();
  await manager.init();
});
