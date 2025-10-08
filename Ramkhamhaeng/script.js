// Ramkhamhaeng-JS-08102025-04

// ---------- include partials ----------
async function includePartialsIfAny() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  if (nodes.length === 0) return;
  for (const node of nodes) {
    const url = node.getAttribute('data-include');
    try{
      const res = await fetch(url, { cache: 'no-store' });
      const html = await res.text();
      const tmp = document.createElement('div'); tmp.innerHTML = html.trim();
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      node.replaceWith(frag);
    }catch(e){
      console.error('Include failed:', url, e);
    }
  }
}

// ---------- dark mode (manual) ----------
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

// ---------- side menu (เฉพาะปุ่มเปิด/ปิด) ----------
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
}

// ---------- password gate (ใหม่) ----------
function initPasswordGate(){
  const overlay = document.getElementById('password-overlay');
  const input   = document.getElementById('password-input');
  const btn     = document.getElementById('submit-button');
  const err     = document.getElementById('error-message');

  if (!overlay || !input || !btn) return; // ไม่มีเกต ไม่ต้องทำอะไร

  const CORRECT = '140425';

  const unlock = ()=>{
    const val = input.value.trim();
    if (val === CORRECT){
      // ซ่อน overlay + ปลดล็อกทั้งหน้า
      overlay.style.display = 'none';
      document.documentElement.classList.remove('pw-lock');
    }else{
      err.textContent = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
      input.value = '';
      input.focus();
    }
  };

  btn.addEventListener('click', unlock);
  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') unlock();
    else err.textContent = '';
  });

  // โฟกัสให้พร้อมกรอกทันที
  setTimeout(()=> input.focus(), 0);
}

// ---------- init all ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  await includePartialsIfAny(); // ต้องรอให้ overlay ถูกรวมเข้ามาก่อน
  initPasswordGate();           // แล้วค่อยผูกอีเวนต์ของปุ่ม/อินพุต
  initDarkMode();
  initSideMenu();
});