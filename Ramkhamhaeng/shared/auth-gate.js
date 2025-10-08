<!-- AuthGate-JS-08102025-01 -->
<script>
// ====== CONFIG ======
const AUTH_PASSWORD = '140425'; // รหัสผ่าน
const BASE = '/20nxskypqz-Exam-Review/Ramkhamhaeng/';
const HTML_URL = BASE + 'shared/auth-gate.html';
const CSS_URL  = BASE + 'shared/auth-gate.css';

// ====== Utilities ======
function ensureCssInjected(href) {
  const exists = [...document.styleSheets].some(s => s.href && s.href.includes(href));
  if (!exists) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

async function ensureOverlayInjected() {
  if (document.getElementById('auth-overlay')) return;
  try {
    const res = await fetch(HTML_URL, { cache: 'no-store' });
    const html = await res.text();
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    document.body.appendChild(wrap.firstElementChild);
  } catch (e) {
    console.error('Load auth overlay failed:', e);
  }
}

// คอนเทนต์ที่จะป้องกัน
function getProtectedTargets() {
  const tpl = document.getElementById('protected-tpl');
  const root = document.getElementById('protected-root');
  if (tpl && root) {
    return { mode: 'template', tpl, root };
  }
  // fallback: ซ่อน main ทั้งก้อน
  const main = document.querySelector('main') || document.body;
  return { mode: 'fallback', main };
}

function hideProtected(targets) {
  if (targets.mode === 'template') {
    targets.root.innerHTML = ''; // ว่างไว้ก่อน
  } else {
    targets.main.style.display = 'none';
  }
}

function revealProtected(targets) {
  if (targets.mode === 'template') {
    const clone = targets.tpl.content.cloneNode(true);
    targets.root.innerHTML = '';
    targets.root.appendChild(clone);
  } else {
    targets.main.style.display = '';
  }
}

// ====== Auth flow ======
function bindAuthHandlers(targets) {
  const overlay = document.getElementById('auth-overlay');
  const input   = document.getElementById('auth-pass');
  const btn     = document.getElementById('auth-submit');
  const errEl   = document.getElementById('auth-error');

  if (!overlay || !input || !btn) return;

  const ok = () => {
    // fade out
    overlay.classList.add('auth-fade');
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); }, 350);
    revealProtected(targets);
  };

  const fail = () => {
    errEl.textContent = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    input.classList.add('auth-input-error');
    input.value = '';
    input.focus();
  };

  const check = () => {
    errEl.textContent = '';
    input.classList.remove('auth-input-error');
    const v = input.value.trim();
    if (v === AUTH_PASSWORD) ok(); else fail();
  };

  btn.addEventListener('click', check);
  input.addEventListener('keydown', (e) => {
    errEl.textContent = '';
    input.classList.remove('auth-input-error');
    if (e.key === 'Enter') check();
  });

  // autofocus
  setTimeout(() => input.focus(), 50);
}

// ====== Boot ======
document.addEventListener('DOMContentLoaded', async () => {
  // 1) ใส่ CSS ให้แน่ใจว่ามี
  ensureCssInjected(CSS_URL);

  // 2) เลือกคอนเทนต์ที่จะป้องกันและ "ซ่อน" ไว้ก่อน
  const targets = getProtectedTargets();
  hideProtected(targets);

  // 3) ดึง/ใส่ overlay ถ้ายังไม่มี
  await ensureOverlayInjected();

  // 4) ผูกอีเวนต์เช็คพาสแล้วค่อยโชว์คอนเทนต์
  bindAuthHandlers(targets);
});
</script>