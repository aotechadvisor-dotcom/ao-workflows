/* ============================================================
   DEPTH EFFECTS — JS pour l'inclinaison 3D des cartes
   À inclure sur TOUTES les pages, juste avant </body>
   ============================================================ */
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const MAX_TILT = 6; // degrés d'inclinaison max — reste subtil, pas gadget

  function attachTilt(card){
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;

      const rotateX = (0.5 - py) * MAX_TILT;
      const rotateY = (px - 0.5) * MAX_TILT;

      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  // S'applique automatiquement à toutes les cartes présentes au chargement...
  document.querySelectorAll('.card').forEach(attachTilt);

  // ...et à celles ajoutées dynamiquement plus tard (ex: catalogue.html
  // qui recrée les cartes après chaque recherche/filtre/page).
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList && node.classList.contains('card')){
          attachTilt(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
