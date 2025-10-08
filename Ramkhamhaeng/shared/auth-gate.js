<!-- AuthGate-JS-08102025-01 -->
<script>
// ===== Password Gate (Standalone, no Tailwind) =====
// เงื่อนไข: ใช้กับหน้า Ramkhamhaeng เท่านั้น
// วิธีใช้หน้าเพจ: 
//   1) ย้ายเนื้อหาหลักไปไว้ใน <template id="protected-tpl"> ... </template>
//   2) วาง <main id="protected-root" class="content"></main> เป็นที่ว่างสำหรับ mount หลังยืนยันสำเร็จ
//   3) อ้างไฟล์นี้ด้วย <script src="shared/auth-gate.js"></script>

(function(){
  const PASS_KEY   = 'ramkham.auth.ok';
  const PASS_VALUE = '1';
  const CORRECT_PASSWORD = '140425'; // รหัสผ่าน

  // inject minimal styles ให้ overlay ใช้ธีมเดียวกับไซต์
  const style = document.createElement('style');
  style.textContent = `
    .auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);
      display:flex;align-items:center;justify-content:center;padding:16px;z-index:3000}
    .auth-modal{width:100%;max-width:420px;background:var(--card,#fff);color:var(--ink,#111);
      border-radius:12px;box-shadow:var(--shadow,0 6px 24px rgba(0,0,0,.08));padding:20px}
    .auth-title{font-size:24px;font-weight:700;margin:0 0 6px;text-align:center}
    .auth-desc{font-size:16px;color:var(--muted,#666);text-align:center;margin:0 0 14px}
    .auth-input{width:100%;padding:12px 14px;border:1px solid #cfd8e3;border-radius:10px;
      font:inherit;font-size:16px;text-align:center;outline:none}
    .auth-input:focus{border-color:#4f46e5;box-shadow:0 0 0 2px rgba(79,70,229,.2)}
    .auth-error{min-height:20px;color:#d32f2f;font-weight:700;font-size:14px;margin:8px 0 0;text-align:center}
    .auth-btn{width:100%;margin-top:10px;padding:12px 14px;border-radius:12px;border:1px solid #4f46e5;
      background:#4f46e5;color:#fff;font-weight:800;cursor:pointer}
    body.dark-mode .auth-modal{background:#172026;color:#e5e7eb}
    body.dark-mode .auth-desc{color:#aab4be}
    body.dark-mode .auth-input{background:#0f1418;border-color:#3b4652;color:#e5e7eb}
    body.dark-mode .auth-input:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,.25)}
    body.dark-mode .auth-btn{background:#6366f1;border-color:#6366f1}
    .auth-fade{transition:opacity .35s ease}
  `;
  document.head.appendChild(style);

  function mountProtectedContent(){
    const tpl   = document.getElementById('protected-tpl');
    const root  = document.getElementById('protected-root');
    if (!tpl || !root) return;
    const frag = tpl.content.cloneNode(true);
    root.appendChild(frag);
  }

  function buildOverlay(){
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay auth-fade';
    overlay.innerHTML = `
      <div class="auth-modal">
        <h2 class="auth-title">ต้องใช้รหัสผ่าน</h2>
        <p class="auth-desc">หน้านี้มีข้อมูลส่วนตัวและมีความละเอียดอ่อน<br>กรุณาใส่รหัสผ่านเพื่อเข้าใช้งาน</p>
        <input type="password" inputmode="numeric" pattern="[0-9]*" class="auth-input" id="auth-pass" placeholder="กรอกรหัสผ่านที่นี่" />
        <div class="auth-error" id="auth-error"></div>
        <button class="auth-btn" id="auth-submit">เข้าสู่ระบบ</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const input  = overlay.querySelector('#auth-pass');
    const btn    = overlay.querySelector('#auth-submit');
    const error  = overlay.querySelector('#auth-error');

    function ok(){
      // fade out
      overlay.style.opacity = '0';
      setTimeout(()=> overlay.remove(), 350);
      sessionStorage.setItem(PASS_KEY, PASS_VALUE);
      mountProtectedContent();
    }
    function fail(){
      error.textContent = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
      input.classList.add('shake');
      input.value = '';
      input.focus();
    }
    function check(){
      if (input.value === CORRECT_PASSWORD) ok(); else fail();
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', (e)=>{
      error.textContent = '';
      if (e.key === 'Enter') check();
    });
    // autofocus
    setTimeout(()=> input.focus(), 50);
    return overlay;
  }

  // main flow
  document.addEventListener('DOMContentLoaded', ()=>{
    const already = sessionStorage.getItem(PASS_KEY) === PASS_VALUE;
    if (already){
      mountProtectedContent();
      return;
    }
    buildOverlay();
  });
})();
</script>