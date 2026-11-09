/* Bioferia · una figura por vez en Inicio y Mi pieza. */
(function () {
  const indices = { home: 0, pieza: 0 };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  function show(carousel, index) {
    const slides = [...carousel.querySelectorAll('.un-slide')];
    if (!slides.length) return;
    const next = (index + slides.length) % slides.length;
    slides.forEach((slide, n) => { slide.hidden = n !== next; });
    carousel.querySelector('.un-carousel-count').textContent =
      String(next + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    indices[carousel.dataset.carousel] = next;
  }
  function setup() {
    if (timer) clearInterval(timer);
    const carousel = document.querySelector('.un-character-carousel');
    if (!carousel) return;
    show(carousel, indices[carousel.dataset.carousel] || 0);
    if (!reduce) timer = setInterval(() => {
      if (!document.hidden && !carousel.matches(':hover, :focus-within')) {
        show(carousel, indices[carousel.dataset.carousel] + 1);
      }
    }, 4400);
  }
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-carousel-action]');
    if (!control) return;
    const carousel = control.closest('.un-character-carousel');
    show(carousel, indices[carousel.dataset.carousel] + (control.dataset.carouselAction === 'next' ? 1 : -1));
  });
  const arrowSvg = '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 19 19 5M8 5h11v11"/></svg>';
  function normalizeArrows() {
    const root = document.querySelector('#app-content');
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('↗')) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || parent.closest('svg')) return;
      if (parent.classList.contains('forward-arrow')) { parent.innerHTML = arrowSvg; return; }
      const parts = node.nodeValue.split('↗'), fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (part) fragment.appendChild(document.createTextNode(part));
        if (index < parts.length - 1) {
          const badge = document.createElement('span');
          badge.className = 'forward-arrow'; badge.setAttribute('aria-hidden','true');
          badge.innerHTML = arrowSvg; fragment.appendChild(badge);
        }
      });
      node.replaceWith(fragment);
    });
  }
  const content = document.querySelector('#app-content');
  new MutationObserver(normalizeArrows).observe(content, { childList: true, subtree: true });
  const previousRender = render;
  render = function () { previousRender(); setup(); normalizeArrows(); };
  render();
})();
