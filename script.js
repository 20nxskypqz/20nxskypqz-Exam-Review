// ExamReview-JS-08102025-12

// ---------- include partials ----------
async function includePartialsIfAny() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  if (nodes.length === 0) return;
  for (const node of nodes) {
    const url = node.getAttribute('data-include');
    try{
      const res = await fetch(url, { cache: 'no-store' });
      const html = await res.text();
      const temp = document.createElement('div');
      temp.innerHTML = html.trim();
      const frag = document.createDocumentFragment();
      while (temp.firstChild) frag.appendChild(temp.firstChild);
      node.replaceWith(frag);
    }catch(e){
      console.error('Include failed:', url, e);
    }
  }
}

// ---------- dark mode (EDITED) ----------
function applyDarkModeClass(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
}
function initDarkMode(){
  const toggleCheckbox = document.getElementById('mode-toggle-checkbox');
  if (!toggleCheckbox) return;

  // Set initial state from localStorage
  const saved = localStorage.getItem('er.dark');
  const isDark = saved === '1';
  applyDarkModeClass(isDark);
  toggleCheckbox.checked = isDark;

  // Add event listener for changes
  toggleCheckbox.addEventListener('change', () => {
    const nowDark = toggleCheckbox.checked;
    applyDarkModeClass(nowDark);
    localStorage.setItem('er.dark', nowDark ? '1' : '0');
  });
}

// ---------- side menu ----------
function initSideMenu(){
  const sideMenu   = document.getElementById('sideMenu');
  const overlay    = document.getElementById('menuOverlay');
  const closeBtn   = document.getElementById('closeMenuBtn');
  const menuBtn    = document.querySelector('.menu-toggle');

  const openMenu = ()=>{
    if (!sideMenu || !overlay) return;
    sideMenu.classList.add('open');
    overlay.classList.add('visible');
    sideMenu.setAttribute('aria-hidden','false');
  };
  const closeMenu = ()=>{
    if (!sideMenu || !overlay) return;
    sideMenu.classList.remove('open');
    overlay.classList.remove('visible');
    sideMenu.setAttribute('aria-hidden','true');
  };

  if (menuBtn)  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay)  overlay.addEventListener('click', closeMenu);

  // dropdowns in side menu
  document.querySelectorAll('.menu-section-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.getAttribute('data-menu-tier');
      if (!key) return;
      const tier = document.getElementById('menu-' + key);
      if (tier){
        const isHidden = tier.hasAttribute('hidden');
        if (isHidden) tier.removeAttribute('hidden'); else tier.setAttribute('hidden','');
        const caret = btn.querySelector('.material-symbols-outlined');
        if (caret) caret.style.transform = (!isHidden) ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
}

// ---------- root dropdowns (M.4/M.5/M.6 + Terms) ----------
function initRootDropdowns(){
  document.querySelectorAll('.tier-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-tier');
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      const willOpen = target.hasAttribute('hidden');
      if (willOpen) target.removeAttribute('hidden'); else target.setAttribute('hidden','');

      // caret rotate + aria-expanded
      const caret = btn.querySelector('.material-symbols-outlined');
      if (caret) caret.style.transform = willOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny();
  initDarkMode();
  initSideMenu();
  initRootDropdowns();
});
