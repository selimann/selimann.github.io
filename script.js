const projects = [
  {
    title: "Solana SDK",
    description:
      "A lightweight TypeScript SDK for Solana—simplifying wallet connections, transaction signing, and SPL token interactions.",
    link: "https://www.npmjs.com/package/@elisedd/solana-sdk",
    tags: ["TypeScript", "Solana", "Blockchain"],
  },
  {
    title: "Solana DApp",
    description:
      "A TypeScript web app that demonstrates how to interact with the Solana blockchain directly from the browser.",
    link: "https://github.com/selimann/solanawallet",
    tags: ["Solana", "TypeScript", "UI"],
  },
];

function renderProjects() {
  const grid = document.querySelector(".projects-grid");
  grid.innerHTML = "";

  projects.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const tagHTML = proj.tags
      .map((t) => `<span class="tech">${t}</span>`)
      .join(" ");

    card.innerHTML = `
    <h3>${proj.title}</h3>
    <p>${proj.description}</p>
    <div class="tags">${tagHTML}</div>
    <a href="${proj.link}" target="_blank" rel="noopener" class="view-btn">View Project</a>
    `;

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderProjects);
