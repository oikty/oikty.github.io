// ── SLIDER ──────────────────────────────────────────────
document.querySelectorAll('.card-slider').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const dots  = slider.querySelector('.slider-dots');
  const imgs  = track.querySelectorAll('img');
  let cur = 0;

  imgs.forEach((_, i) => {
    const d = document.createElement('span');
    if (i === 0) d.classList.add('active');
    dots.appendChild(d);
  });

  function go(n) {
    cur = (n + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.querySelectorAll('span').forEach((d, i) =>
      d.classList.toggle('active', i === cur));
  }

  slider.querySelector('.prev').addEventListener('click', () => go(cur - 1));
  slider.querySelector('.next').addEventListener('click', () => go(cur + 1));

  // Click en imagen → abrir lightbox en esa foto
  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(slider, i);
    });
  });
});

// ── LIGHTBOX ─────────────────────────────────────────────
function openLightbox(slider, startIndex) {
  const imgs = Array.from(slider.querySelectorAll('.slider-track img'));
  let cur = startIndex;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close">✕</button>
    <button class="lb-nav lb-prev">‹</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="">
    </div>
    <button class="lb-nav lb-next">›</button>
    <div class="lb-counter"></div>
  `;
  document.body.appendChild(lb);

  // Forzar reflow para que la animación funcione
  requestAnimationFrame(() => lb.classList.add('lb-open'));

  const lbImg     = lb.querySelector('.lb-img');
  const counter   = lb.querySelector('.lb-counter');

  function show(n) {
    cur = (n + imgs.length) % imgs.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = imgs[cur].src;
      lbImg.alt = imgs[cur].alt;
      counter.textContent = `${cur + 1} / ${imgs.length}`;
      lbImg.style.opacity = '1';
    }, 150);
  }

  function close() {
    lb.classList.remove('lb-open');
    setTimeout(() => lb.remove(), 300);
  }

  show(cur);

  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-backdrop').addEventListener('click', close);

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape')      { close(); document.removeEventListener('keydown', onKey); }
    if (e.key === 'ArrowRight')  show(cur + 1);
    if (e.key === 'ArrowLeft')   show(cur - 1);
  });
}