// script.js
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000); // 1000ms = 1 segundo de retraso antes de que las animaciones comiencen
};