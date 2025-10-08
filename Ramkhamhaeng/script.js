// Ramkhamhaeng-JS-08102025-01

// include side-menu (เฉพาะใน Ramkhamhaeng)
async function includePartialsIfAny(){
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  for (const node of nodes){
    const url = node.getAttribute('data-include');
    try{
      const res = await fetch(url, { cache:'no-store' });
      const html = await res.text();
      const temp = document.createElement('div'); temp.innerHTML = html.trim();
      const frag = document.createDocumentFragment();
      while (temp.firstChild) frag.appendChild(temp.firstChild);
      node.replaceWith(frag);
    }catch(e){
      console.error('Include failed:', url, e);
    }
  }
}

// โหมดมืด (manual)
function applyDark(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
  const icon = document.getElementById('mode-icon');
  if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}
function initDarkMode(){
  const saved = localStorage.getItem('rk.dark');
  const isDark = saved === '1';
  applyDark(isDark);
  const toggle = document.getElementById('mode-toggle');
  if (toggle){
    const handler = ()=>{
      const nowDark = !document.body.classList.contains('dark-mode');
      applyDark(nowDark);
      localStorage.setItem('rk.dark', nowDark ? '1' : '0');
    };
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }
    });
  }
}

// สไลด์เมนู (ขนาดคงที่, ไม่เต็มจอ)
function initSideMenu(){
  const sideMenu = document.getElementById('sideMenu');
  const overlay  = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('closeMenuBtn');
  const menuBtn  = document.querySelector('.menu-toggle');

  const openMenu = ()=>{
    if(!sideMenu || !overlay) return;
    sideMenu.classList.add('open');
    overlay.classList.add('visible');
    sideMenu.setAttribute('aria-hidden','false');
  };
  const closeMenu = ()=>{
    if(!sideMenu || !overlay) return;
    sideMenu.classList.remove('open');
    overlay.classList.remove('visible');
    sideMenu.setAttribute('aria-hidden','true');
  };

  if (menuBtn)  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay)  overlay.addEventListener('click', closeMenu);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny();
  initDarkMode();
  initSideMenu();
});