// Ramkhamhaeng-JS-08102025-01

// include partials (side menu)
async function includePartialsIfAny() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  for (const node of nodes) {
    const url = node.getAttribute('data-include');
    try{
      const res  = await fetch(url, { cache:'no-store' });
      const html = await res.text();
      const wrap = document.createElement('div'); wrap.innerHTML = html.trim();
      const frag = document.createDocumentFragment();
      while (wrap.firstChild) frag.appendChild(wrap.firstChild);
      node.replaceWith(frag);
    }catch(e){
      console.error('Include failed:', url, e);
    }
  }
}

// dark mode
function applyDarkModeClass(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
  const icon = document.getElementById('mode-icon');
  if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}
function initDarkMode(){
  const saved = localStorage.getItem('ram.dark');
  const isDark = saved === '1';
  applyDarkModeClass(isDark);

  const toggle = document.getElementById('mode-toggle');
  if (toggle){
    const handler = ()=>{
      const nowDark = !document.body.classList.contains('dark-mode');
      applyDarkModeClass(nowDark);
      localStorage.setItem('ram.dark', nowDark ? '1' : '0');
    };
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }});
  }
}

// side menu
function initSideMenu(){
  const sideMenu = document.getElementById('sideMenu');
  const overlay  = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('closeMenuBtn');
  const menuBtn  = document.querySelector('.menu-toggle');

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

  // dropdowns inside side menu
  document.querySelectorAll('.menu-section-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.getAttribute('data-menu-tier');
      if (!key) return;
      const tier = document.getElementById('menu-' + key);
      if (!tier) return;
      const isHidden = tier.hasAttribute('hidden');
      if (isHidden) tier.removeAttribute('hidden'); else tier.setAttribute('hidden','');

      const caret = btn.querySelector('.material-symbols-outlined');
      if (caret) caret.style.transform = (tier && !tier.hasAttribute('hidden')) ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });
}

// init
document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny();
  initDarkMode();
  initSideMenu();
});