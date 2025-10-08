// RAM1131-JS-03102025-[Complete]

// ----- Dark mode (standalone) -----
function applyDarkMode(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
  const icon = document.getElementById('mode-icon');
  if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}

function initDarkMode(){
  const saved = localStorage.getItem('ram.dark');
  const isDark = saved === '1';
  applyDarkMode(isDark);

  const toggle = document.getElementById('mode-toggle');
  if (toggle){
    const handler = ()=>{
      const nowDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(nowDark);
      localStorage.setItem('ram.dark', nowDark ? '1' : '0');
    };
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }
    });
  }
}

document.addEventListener('DOMContentLoaded', initDarkMode);