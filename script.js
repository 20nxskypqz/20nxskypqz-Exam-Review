// ExamReview-JS-081025-13

// ---------- include partials ----------
async function includePartialsIfAny() {
  let nodesToInclude = document.querySelectorAll('[data-include]');
  while (nodesToInclude.length > 0) {
    for (const node of nodesToInclude) {
      const url = node.getAttribute('data-include');
      try{
        node.setAttribute('data-include', ''); 
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        const html = await res.text();
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();
        const frag = document.createDocumentFragment();
        while (temp.firstChild) { frag.appendChild(temp.firstChild); }
        node.replaceWith(frag);
      } catch(e) { console.error('Include failed:', url, e); node.remove(); }
    }
    nodesToInclude = document.querySelectorAll('[data-include]:not([data-include=""])');
  }
}

// ---------- dark mode ----------
function applyDarkModeClass(isDark){ document.body.classList.toggle('dark-mode', !!isDark); }
function initDarkMode(){
  const toggleCheckbox = document.getElementById('mode-toggle-checkbox');
  if (!toggleCheckbox) return;
  const saved = localStorage.getItem('er.dark');
  const isDark = saved === '1';
  applyDarkModeClass(isDark);
  toggleCheckbox.checked = isDark;
  toggleCheckbox.addEventListener('change', () => {
    const nowDark = toggleCheckbox.checked;
    applyDarkModeClass(nowDark);
    localStorage.setItem('er.dark', nowDark ? '1' : '0');
  });
}

// ---------- side menu (EDITED for Liquid Glass Menu) ----------
function initSideMenu(){
  const menuToggle = document.getElementById('menuToggle');
  const slideMenu  = document.getElementById('sideMenu');
  const closeBtn   = document.getElementById('closeMenuBtn');

  if (!menuToggle || !slideMenu || !closeBtn) {
    console.warn('Side menu elements not found.');
    return;
  }

  const openMenu = () => {
    slideMenu.classList.add('active');
    document.body.classList.add('menu-active');
    slideMenu.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    slideMenu.classList.remove('active');
    document.body.classList.remove('menu-active');
    slideMenu.setAttribute('aria-hidden', 'true');
  };

  menuToggle.addEventListener('click', (e) => { e.stopPropagation(); openMenu(); });
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeMenu(); });

  slideMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-section-toggle');
    if (btn) {
      e.stopPropagation();
      const key = btn.getAttribute('data-menu-tier');
      if (!key) return;
      const tier = document.getElementById('menu-' + key);
      if (!tier) return;
      const willShow = tier.hasAttribute('hidden');
      if (willShow) tier.removeAttribute('hidden'); else tier.setAttribute('hidden', '');
      const caret = btn.querySelector('.material-symbols-outlined');
      if (caret) caret.style.transform = willShow ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });

  document.addEventListener('click', (e) => {
    if (slideMenu.classList.contains('active') && !e.target.closest('#sideMenu')) {
      closeMenu();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slideMenu.classList.contains('active')) {
      closeMenu();
    }
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
