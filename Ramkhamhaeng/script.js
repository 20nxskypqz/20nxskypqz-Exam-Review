// Ramkhamhaeng-JS-081025-07

// ---------- include partials ----------
async function includePartialsIfAny() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  for (const node of nodes) {
    const url = node.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const html = await res.text();
      const temp = document.createElement('div'); temp.innerHTML = html.trim();
      const frag = document.createDocumentFragment();
      while (temp.firstChild) frag.appendChild(temp.firstChild);
      node.replaceWith(frag);
    } catch (e) { console.error('Include failed:', url, e); }
  }
}

// ---------- dark mode ----------
function applyDarkModeClass(isDark){
  document.body.classList.toggle('dark-mode', !!isDark);
}
function initDarkMode(){
  const toggleCheckbox = document.getElementById('mode-toggle-checkbox');
  if (!toggleCheckbox) return;
  const saved = localStorage.getItem('ram.dark');
  const isDark = saved === '1';
  applyDarkModeClass(isDark);
  toggleCheckbox.checked = isDark;
  toggleCheckbox.addEventListener('change', () => {
    const nowDark = toggleCheckbox.checked;
    applyDarkModeClass(nowDark);
    localStorage.setItem('ram.dark', nowDark ? '1' : '0');
  });
}

// ---------- password gate ----------
function initPasswordGate(){
  const overlay = document.getElementById('password-overlay');
  const input = document.getElementById('password-input');
  const btn = document.getElementById('submit-button');
  const err = document.getElementById('error-message');
  if(!overlay || !input || !btn) {
    document.documentElement.classList.remove('pw-lock');
    return;
  }
  const CORRECT_PASSWORD = '140425';
  const unlock = ()=>{
    overlay.style.display = 'none';
    document.documentElement.classList.remove('pw-lock');
  };
  const fail = ()=>{
    err.textContent = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    input.classList.add('border-red-500');
    input.value = '';
    input.focus();
  };
  const check = ()=> (input.value === CORRECT_PASSWORD) ? unlock() : fail();
  btn.addEventListener('click', check);
  input.addEventListener('keydown', e=>{
    if(e.key === 'Enter') check();
    err.textContent = '';
    input.classList.remove('border-red-500');
  });
}

// ---------- side menu (for icon swapping) ----------
function initSideMenu(){
  const menuToggle = document.getElementById('menuToggle');
  const slideMenu  = document.getElementById('sideMenu');

  if (!menuToggle || !slideMenu) {
    console.warn('Side menu elements not found.');
    return;
  }

  const icon = menuToggle.querySelector('.material-symbols-outlined');

  const openMenu = () => {
    slideMenu.classList.add('active');
    document.body.classList.add('menu-active');
    slideMenu.setAttribute('aria-hidden', 'false');
    if (icon) icon.textContent = 'close';
  };

  const closeMenu = () => {
    slideMenu.classList.remove('active');
    document.body.classList.remove('menu-active');
    slideMenu.setAttribute('aria-hidden', 'true');
    if (icon) icon.textContent = 'menu';
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (slideMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

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
    if (slideMenu.classList.contains('active')) {
      if (!e.target.closest('#menuToggle') && !e.target.closest('#sideMenu')) {
        closeMenu();
      }
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slideMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny();
  initPasswordGate();
  initDarkMode();
  initSideMenu();
});
