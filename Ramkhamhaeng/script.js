// Ramkhamhaeng-JS-03102025-[Complete]

// ----- Dark mode (standalone) -----
function applyDarkMode(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
  const icon = document.getElementById('mode-icon');
  if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}

function initDarkMode(){
  const saved = localStorage.getItem('ram.root.dark');
  const isDark = saved === '1';
  applyDarkMode(isDark);

  const toggle = document.getElementById('mode-toggle');
  if (toggle){
    const handler = ()=>{
      const nowDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(nowDark);
      localStorage.setItem('ram.root.dark', nowDark ? '1' : '0');
    };
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }
    });
  }
}

// ----- Root dropdown (caret down when closed, up when opened) -----
function initRootDropdowns(){
  document.querySelectorAll('.tier-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-tier');
      const target = document.getElementById(id);
      if (!target) return;

      const willShow = target.hasAttribute('hidden');
      if (willShow) target.removeAttribute('hidden'); else target.setAttribute('hidden','');

      // caret icon rotate
      const caret = btn.querySelector('.caret');
      if (caret){
        caret.style.transform = willShow ? 'rotate(180deg)' : 'rotate(0deg)';
      }

      // aria-expanded
      btn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initDarkMode();
  initRootDropdowns();
});