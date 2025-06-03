// Script pour surligner le lien actif dans la navigation
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const currentURL = window.location.href;

  navLinks.forEach(link => {
    if (currentURL.includes(link.getAttribute("href"))) {
      link.style.color = "#ffffff";
    }
  });
});
