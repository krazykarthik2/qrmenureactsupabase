document.querySelectorAll(".nav-buttons a").forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Navigating to:", btn.getAttribute("href"));
  });
});
