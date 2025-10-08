/* AuthGate-JS-08102025-02 */
// แสดงป๊อปอัปถามรหัส และโหลดคอนเทนต์จาก <template id="protected-tpl"> เมื่อใส่ถูก

(function () {
  const PASS = '140425'; // รหัสผ่านตามที่กำหนด
  const ROOT_ID = 'protected-root';
  const TPL_ID  = 'protected-tpl';

  // สไตล์ป๊อปอัป (ขาวล้วนทั้งหน้าตามที่ขอ)
  const style = document.createElement('style');
  style.textContent = `
    .rk-auth-overlay{
      position:fixed; inset:0; background:#ffffff; z-index:9999;
      display:flex; align-items:center; justify-content:center; padding:20px;
      font-family: 'Niramit', system-ui, -apple-system, Segoe UI, Arial, sans-serif;
    }
    .rk-auth-card{
      width:100%; max-width:420px; background:#fff; border-radius:14px;
      box-shadow:0 6px 24px rgba(0,0,0,.12); padding:22px;
    }
    .rk-auth-title{ margin:0 0 8px; font-size:22px; font-weight:700; color:#111; text-align:center; }
    .rk-auth-sub{ margin:0 0 14px; font-size:14px; color:#666; text-align:center; }
    .rk-auth-input{
      width:100%; padding:12px 14px; font-size:16px; border:1px solid #d0d7de; border-radius:10px;
      outline:none;
    }
    .rk-auth-input:focus{ border-color:#4f46e5; box-shadow:0 0 0 3px rgba(79,70,229,.15); }
    .rk-auth-error{ min-height:18px; color:#c00; font-weight:700; font-size:13px; margin:8px 0 0; text-align:center; }
    .rk-auth-btn{
      width:100%; margin-top:12px; background:#111; color:#fff; border:0; border-radius:999px;
      padding:10px 14px; font-weight:800; cursor:pointer;
    }
  `;
  document.head.appendChild(style);

  function mountOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'rk-auth-overlay';
    overlay.innerHTML = `
      <div class="rk-auth-card">
        <h2 class="rk-auth-title">ต้องใช้รหัสผ่าน</h2>
        <p class="rk-auth-sub">หน้านี้เป็นเนื้อหาส่วนตัว<br/>กรุณาใส่รหัสผ่านเพื่อเข้าถึง</p>
        <input type="password" class="rk-auth-input" id="rk-pass" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัสผ่านที่นี่" />
        <div class="rk-auth-error" id="rk-err"></div>
        <button class="rk-auth-btn" id="rk-submit">เข้าสู่ระบบ</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function unlock() {
    // ใส่คอนเทนต์จริงจาก template
    const tpl = document.getElementById(TPL_ID);
    const root = document.getElementById(ROOT_ID);
    if (tpl && root) {
      const clone = tpl.content.cloneNode(true);
      root.appendChild(clone);

      // include ชิ้นส่วน (สไลด์เมนู)
      if (typeof includePartialsIfAny === 'function') {
        includePartialsIfAny().then(() => {
          // init โหมดมืด/เมนู หลัง include เสร็จ
          if (typeof initDarkMode === 'function') initDarkMode();
          if (typeof initSideMenu === 'function') initSideMenu();
        });
      }
      else {
        // เผื่อไม่มี script.js
        if (typeof initDarkMode === 'function') initDarkMode();
        if (typeof initSideMenu === 'function') initSideMenu();
      }
    }
  }

  function attachLogic(overlay) {
    const input  = overlay.querySelector('#rk-pass');
    const submit = overlay.querySelector('#rk-submit');
    const err    = overlay.querySelector('#rk-err');

    const tryLogin = () => {
      if (input.value === PASS) {
        overlay.remove();        // เอาป๊อปอัปออก
        unlock();                // โหลดคอนเทนต์จริง
      } else {
        err.textContent = 'รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง';
        input.value = '';
        input.focus();
      }
    };

    submit.addEventListener('click', tryLogin);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryLogin();
      err.textContent = '';
    });

    // โฟกัสอัตโนมัติ
    setTimeout(() => input.focus(), 0);
  }

  // เริ่มทำงาน: แสดงหน้าว่าง + ป๊อปอัป
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = mountOverlay();
    attachLogic(overlay);
  });
})();