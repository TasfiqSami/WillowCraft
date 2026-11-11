(() => {
  try {
    const saved = localStorage.getItem('willowcraft-theme');
    const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch { document.documentElement.dataset.theme = 'dark'; }
})();
