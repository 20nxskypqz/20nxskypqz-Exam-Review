<!-- password-gate-js-08102025-01 [Complete] -->
<script>
(()=> {
  const CORRECT_PASSWORD = '140425'; // ตั้งรหัสที่นี่

  function initGate(){
    const overlay = document.getElementById('password-overlay');
    const input   = document.getElementById('password-input');
    const submit  = document.getElementById('submit-button');
    const errorEl = document.getElementById('error-message');
    const content = document.querySelector('#private-content');

    if (!overlay || !input || !submit || !content) return false;

    const unlock = () => {
      const ok = input.value === CORRECT_PASSWORD;
      if (ok){
        overlay.remove();
        content.removeAttribute('hidden');
      } else {
        errorEl.textContent = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
        input.value = '';
        input.focus();
      }
    };

    submit.addEventListener('click', unlock);
    input.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter'){ e.preventDefault(); unlock(); }
      if (errorEl.textContent){ errorEl.textContent=''; }
    });

    // เริ่มต้น: ซ่อนเนื้อหาไว้ก่อน
    content.setAttribute('hidden','');
    // โฟกัสช่องกรอก
    setTimeout(()=>input.focus(), 0);
    return true;
  }

  function waitForOverlay(){
    if (initGate()) return;
    const obs = new MutationObserver(()=>{
      if (initGate()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList:true, subtree:true });
  }

  document.addEventListener('DOMContentLoaded', waitForOverlay);
})();
</script>