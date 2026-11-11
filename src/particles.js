(() => {
  const canvas = document.querySelector('.particle-canvas');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let particles = [], raf = 0, width = 0, height = 0, inView = false;
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = box.width; height = box.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(80, Math.max(18, Math.floor(width / 18)));
    particles = Array.from({ length: count }, () => {
      const rain = Math.random() < .28;
      return {
        x: Math.random() * width, y: Math.random() * height,
        radius: Math.random() * 1.35 + .45,
        speed: Math.random() * (rain ? .64 : .27) + (rain ? .32 : .07),
        drift: (Math.random() - .5) * (rain ? .08 : .17),
        alpha: Math.random() * .34 + .1,
        length: rain ? Math.random() * 8 + 3 : 0,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() < .18 ? '190,206,255' : '190,246,203'
      };
    });
  };
  const draw = time => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      const direction = p.length ? 1 : -1;
      p.y += p.speed * direction;
      p.x += p.drift + Math.sin(time / 3200 + p.phase) * .035;
      if (p.y > height + 10) { p.y = -8; p.x = Math.random() * width; }
      if (p.y < -10) { p.y = height + 8; p.x = Math.random() * width; }
      const pulse = .76 + Math.sin(time / 1100 + p.phase) * .2;
      ctx.beginPath();
      if (p.length) {
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.drift * 5, p.y - p.length);
        ctx.strokeStyle = `rgba(${p.color},${p.alpha * pulse * .72})`;
        ctx.lineWidth = p.radius; ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha * pulse})`; ctx.fill();
      }
    }
    raf = requestAnimationFrame(draw);
  };
  const update = () => {
    const shouldRun = inView && !document.hidden;
    if (shouldRun && !raf) raf = requestAnimationFrame(draw);
    else if (!shouldRun && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
  resize(); observer.observe(canvas);
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', update);
})();
