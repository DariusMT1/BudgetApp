// theme.js

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
});

function setTheme(theme) {
  document.body.className = `${theme}-theme`;
  localStorage.setItem('theme', theme);
}
