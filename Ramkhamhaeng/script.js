// Ramkhamhaeng-JS-08102025-06

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
    } catch (e) {
      console.error('Include failed:', url, e);
    }
  }
}

// ---------- dark mode ----------
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
  const handler = ()=>{
    const nowDark = !document.body.classList.contains('dark-mode');
    applyDarkModeClass(nowDark);
    localStorage.setItem('ram.dark', nowDark ? '1' : '0');
  };
  if (toggle){
    toggle.addEventListener('click', handler);
    toggle.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handler(); }
    });
  }
}

// ---------- password gate (from shared/password-gate.html) ----------
function initPasswordGate(){
  const overlay = document.getElementById('password-overlay');
  const input   = document.getElementById('password-input');
  const btn     = document.getElementById('submit-button');
  const err     = document.getElementById('error-message');
  if(!overlay || !input || !btn) {
    // ไม่มีเกต -> ปลดล็อกทันที
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

// ---------- side menu (with event delegation) ----------
function initSideMenu(){
  const sideMenu = document.getElementById('sideMenu');
  const overlay  = document.getElementById('menuOverlay');

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

  // ใช้ event delegation เพื่อให้ทำงานเสมอ
  document.addEventListener('click', (e)=>{
    // เปิดเมนู
    if (e.target.closest('.menu-toggle')) {
      openMenu(); return;
    }
    // ปิดเมนู
    if (e.target.closest('#closeMenuBtn') || e.target.closest('#menuOverlay')) {
      closeMenu(); return;
    }
    // สลับ dropdown ภายในเมนู
    const btn = e.target.closest('.menu-section-toggle');
    if (btn && btn.closest('#sideMenu')) {
      const key = btn.getAttribute('data-menu-tier');
      if (!key) return;
      const tier = document.getElementById('menu-' + key);
      if (!tier) return;
      const willShow = tier.hasAttribute('hidden');
      if (willShow) tier.removeAttribute('hidden'); else tier.setAttribute('hidden','');

      // หมุนลูกศรลง (ปิด) / ขึ้น (เปิด)
      const caret = btn.querySelector('.material-symbols-outlined');
      if (caret) caret.style.transform = willShow ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny();   // ดึง side-menu มาก่อน
  initPasswordGate();             // gate ก่อนใช้งาน
  initDarkMode();
  initSideMenu();                 // เมนูพร้อมและใช้ delegation แล้ว
});