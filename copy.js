function copySolanaAddress() {
  const address = document.getElementById("solanaAddress").innerText;
  navigator.clipboard.writeText(address).then(() => {
    const button = document.querySelector(".copy-btn");
    const originalText = button.innerText;
    button.innerText = "Copied!";
    button.style.color = "#ee00ffff";

    setTimeout(() => {
      button.innerText = originalText;
      button.style.color = "";
    }, 2000);
  });
}
