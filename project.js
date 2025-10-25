function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function copySolanaAddress() {
  const address = document.getElementById("solanaAddress")?.innerText;
  if (!address) {
    console.warn("Solana address not found!");
    return;
  }
  navigator.clipboard.writeText(address).then(() => {
    const button = document.querySelector(".copy-btn");
    if (!button) return;
    const originalText = button.innerText;
    button.innerText = "Copied!";
    button.style.color = "#ee00ff";
    setTimeout(() => {
      button.innerText = originalText;
      button.style.color = "";
    }, 2000);
  });
}
function copyCodeToClipboard(codeBlock) {
  const code = codeBlock.querySelector("code").textContent;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const button = codeBlock.querySelector(".copy-button");
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.style.background = "#ee00ff";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      alert("Failed to copy code");
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("project-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p style='color:red;'>No project ID specified.</p>";
    return;
  }

  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const project = data.projects.find((p) => p.id === id);

    if (!project) {
      container.innerHTML = `<p style='color:red;'>Project '${id}' not found.</p>`;
      return;
    }

    let html = `
      <div class="project-header">
        <h1>${project.title}</h1>
        <div class="tag-list">
          ${project.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    `;
    project.content.forEach((block) => {
      if (block.type === "image-left" || block.type === "image-right") {
        html += `
          <div class="project-body ${block.type}">
            <div class="project-picture">
              <img src="${block.image}" alt="${project.title}">
            </div>
            <div class="project-description">
              ${block.text.map((p) => `<p>${p}</p>`).join("")}
            </div>
          </div>
        `;
      } else if (block.type === "text-only") {
        html += `
          <div class="project-body text-only">
            <div class="project-description">
              ${block.text.map((p) => `<p>${p}</p>`).join("")}
            </div>
          </div>
        `;
      } else if (block.type === "code") {
        html += `
    <div class="project-body code-block">
      <div class="code-header">
        <span class="code-language">${block.language || "rust"}</span>
        <button class="copy-button icon-version" onclick="copyCodeToClipboard(this.parentElement.parentElement)">
          Copy
        </button>
      </div>
      <pre class="project-code language-${
        block.language || "rust"
      }"><code>${escapeHtml(block.code)}</code></pre>
    </div>
  `;
      }
    });

    container.innerHTML = html;

    if (window.Prism) {
      Prism.highlightAllUnder(container);
    }
  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Error loading project: ${err.message}</p>`;
    console.error(err);
  }
});
