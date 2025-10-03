// ExamReview-JS-03102025-[Complete]

// ---------- Simple include loader (relative paths for Project Pages) ----------
async function includePartials() {
  const nodes = document.querySelectorAll('[data-include]');
  for (const node of nodes) {
    const src = node.getAttribute('data-include');
    try {
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error(src + ' [' + res.status + ']');
      const html = await res.text();
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      // replace node with fetched content
      while (wrap.firstChild) node.parentNode.insertBefore(wrap.firstChild, node);
      node.remove();
    } catch (e) {
      console.error('Include failed:', e);
    }
  }
}

// ---------- Wire shared UI after includes injected ----------
function wireSharedUI() {
  // menu open/close
  const menu = document.querySelector('.side-menu');
  const overlay = document.querySelector('.menu-overlay');
  const openBtns = document.querySelectorAll('.menu-toggle');
  const closeBtn = document.querySelector('.close-menu');

  function openMenu() {
    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('visible');
  }
  function closeMenu() {
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  }

  openBtns.forEach(b => b.addEventListener('click', openMenu));
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // side menu section toggles
  document.querySelectorAll('.menu-section-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const list = document.querySelector(`.menu-sublist[data-menu="${target}"]`);
      if (!list) return;
      const icon = btn.querySelector('.material-symbols-outlined');
      const nowHidden = list.hasAttribute('hidden');
      if (nowHidden) {
        list.removeAttribute('hidden');
        if (icon) icon.textContent = 'arrow_drop_down'; // opened
      } else {
        list.setAttribute('hidden', '');
        if (icon) icon.textContent = 'arrow_right'; // collapsed
      }
    });
  });

  // manual dark mode toggle
  const modeToggle = document.getElementById('mode-toggle');
  const modeIcon = document.getElementById('mode-icon');
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (modeIcon) {
        // switch icon
        const dark = document.body.classList.contains('dark-mode');
        modeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
      }
    });
  }
}

// ---------- Root page collapsibles (M/Term) ----------
function wireRootDropdowns() {
  // Tier 1/2 dropdowns by data-drop / data-target
  document.querySelectorAll('[data-drop]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-drop');
      const body = document.querySelector(`[data-target="${key}"]`);
      if (!body) return;
      const icon = btn.querySelector('.material-symbols-outlined');
      const nowHidden = body.hasAttribute('hidden');
      if (nowHidden) {
        body.removeAttribute('hidden');
        if (icon) icon.textContent = 'arrow_drop_down';
      } else {
        body.setAttribute('hidden', '');
        if (icon) icon.textContent = 'arrow_right';
      }
    });
  });
}

// ---------- Boot ----------
(async function init() {
  await includePartials();
  wireSharedUI();
  wireRootDropdowns();
})();