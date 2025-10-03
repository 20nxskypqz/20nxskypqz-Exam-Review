/* ExamReview-js-0310-[Complete] */

// ====== Side menu open/close ======
const menuBtn   = document.querySelector('.menu-toggle');
const sideMenu  = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenuBtn');
const menuOv    = document.getElementById('menuOverlay');

function openMenu(){
  sideMenu.classList.add('open');
  sideMenu.setAttribute('aria-hidden','false');
  menuOv.classList.add('visible');
}
function closeMenuFn(){
  sideMenu.classList.remove('open');
  sideMenu.setAttribute('aria-hidden','true');
  menuOv.classList.remove('visible');
}
menuBtn.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFn);
menuOv.addEventListener('click', closeMenuFn);

// ====== Dark mode ======
const modeToggle = document.getElementById('mode-toggle');
const modeIcon   = document.getElementById('mode-icon');

function applyModeIcon(){
  const isDark = document.body.classList.contains('dark-mode');
  modeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
}
function toggleMode(){
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('examReviewMode', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  applyModeIcon();
}
modeToggle.addEventListener('click', toggleMode);
modeToggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') toggleMode(); });
(function initMode(){
  const saved = localStorage.getItem('examReviewMode');
  if(saved === 'dark') document.body.classList.add('dark-mode');
  applyModeIcon();
})();

// ====== Root page hierarchical toggles ======
function wireTierToggles(scope=document){
  // Buttons that control show/hide by data-tier (targets by id)
  const tierButtons = scope.querySelectorAll('.tier-toggle');
  tierButtons.forEach(btn=>{
    const targetId = btn.getAttribute('data-tier');
    const target   = document.getElementById(targetId);
    const icon     = btn.querySelector('.material-symbols-outlined');
    if(!target) return;

    btn.addEventListener('click', ()=>{
      const willOpen = target.hasAttribute('hidden');
      if(willOpen){
        target.removeAttribute('hidden');
        btn.setAttribute('aria-expanded','true');
        icon && icon.classList.add('rot-180');
      }else{
        target.setAttribute('hidden','');
        btn.setAttribute('aria-expanded','false');
        icon && icon.classList.remove('rot-180');
      }
    });
  });

  // In side menu: .menu-section-toggle toggles next tier or specific id by data-menu-tier
  const menuToggles = scope.querySelectorAll('.menu-section-toggle');
  menuToggles.forEach(btn=>{
    const key = btn.getAttribute('data-menu-tier');
    const icon = btn.querySelector('.caret');
    let target = null;

    if(key){
      // find matching id (menu-*)
      target = document.getElementById(key.startsWith('m') ? `menu-${key}` : key);
      // fallback: nextElementSibling for nested UL
      if(!target) target = btn.nextElementSibling;
    }else{
      target = btn.nextElementSibling;
    }
    if(!target) return;

    btn.addEventListener('click', ()=>{
      const willOpen = target.hasAttribute('hidden');
      if(willOpen){
        target.removeAttribute('hidden');
        icon && icon.classList.add('rot-180');
      }else{
        target.setAttribute('hidden','');
        icon && icon.classList.remove('rot-180');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  wireTierToggles(document);
});