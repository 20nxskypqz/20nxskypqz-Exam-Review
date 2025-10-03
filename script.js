// ====== Data groups (DOCX lists used on index page) ======
const SOCIAL = {
  id: 'soc',
  title: 'สังคมศึกษา ม.4_1-68',
  docs: [
    { file: 'files/สังคมศึกษาทุกเรื่องม.4_1-68.docx', title: 'สังคมศึกษาทุกเรื่อง ม.4_1-68' }
  ]
};
const BIO = {
  id: 'bio',
  title: 'ชีววิทยา ม.4_1-68',
  docs: [
    { file: 'files/การศึกษาชีววิทยา.docx',              title: 'การศึกษาชีววิทยา' },
    { file: 'files/เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต.docx', title: 'เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต' },
    { file: 'files/เซลล์และการทำงานของเซลล์.docx',       title: 'เซลล์และการทำงานของเซลล์' }
  ]
};
const E31101 = { id:'e31101', title:'E31101 M.4_1-68', docs:[ { file:'files/E31101.docx', title:'E31101' } ] };
const T31101 = { id:'t31101', title:'ท31101 M.4_1-68', docs:[ { file:'files/ท31101.docx', title:'ท31101' } ] };

// ====== DOM ======
const statusEl   = document.getElementById('status');
const contentEl  = document.getElementById('content');
const reloadBtn  = document.getElementById('reload');
const dlHtmlBtn  = document.getElementById('downloadHtml');

const menuBtn    = document.querySelector('.menu-toggle');
const sideMenu   = document.getElementById('sideMenu');
const closeMenu  = document.getElementById('closeMenuBtn');
const menuOv     = document.getElementById('menuOverlay');

const modeToggle = document.getElementById('mode-toggle');
const modeIcon   = document.getElementById('mode-icon');

// ====== Helpers ======
async function loadArrayBuffer(url) {
  const res = await fetch(encodeURI(url), { cache: 'no-store' });
  if (!res.ok) throw new Error('โหลดไฟล์ไม่ได้: ' + url + ' [' + res.status + ']');
  return await res.arrayBuffer();
}

const mammothOptions = {
  styleMap: [
    "p[style-name='Title'] => h1:fresh",
    "p[style-name='Subtitle'] => h2:fresh",
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "b => strong",
    "i => em"
  ]
};

function fixListSpacing(container) {
  container.querySelectorAll('li').forEach(li => {
    li.innerHTML = li.innerHTML
      .replace(/^(\d+)\.\s?/, (_, m) => m + '. ')
      .replace(/^•\s?/, '• ');
  });
}

function makeMajorSection(id, title) {
  const wrap = document.createElement('section');
  wrap.className = 'major-section';
  wrap.id = id;

  const h = document.createElement('div');
  h.className = 'major-heading';
  h.textContent = title;

  wrap.appendChild(h);
  return wrap;
}

async function renderGroup(group) {
  const container = makeMajorSection(group.id, group.title);

  for (const entry of group.docs) {
    try {
      const buf = await loadArrayBuffer(entry.file);
      const { value: html, messages } = await window.mammoth.convertToHtml({ arrayBuffer: buf }, mammothOptions);

      const sec = document.createElement('section');
      sec.className = 'doc-section';

      const h = document.createElement('div');
      h.className = 'doc-heading';
      h.textContent = entry.title;
      sec.appendChild(h);

      const holder = document.createElement('div');
      holder.innerHTML = html;
      fixListSpacing(holder);

      sec.appendChild(holder);
      container.appendChild(sec);

      if (messages && messages.length) console.log('Mammoth messages for', entry.file, messages);
    } catch (e) {
      console.error(e);
      const err = document.createElement('div');
      err.style.color = '#c00';
      err.style.fontWeight = '700';
      err.style.margin = '8px 0 16px';
      err.textContent = 'โหลดเอกสารไม่ได้: ' + entry.file;
      container.appendChild(err);
    }
  }
  return container;
}

async function renderAll() {
  try {
    statusEl.textContent = 'Loading documents…';
    contentEl.innerHTML = '';

    const socNode    = await renderGroup(SOCIAL);
    const bioNode    = await renderGroup(BIO);
    const e31101Node = await renderGroup(E31101);
    const t31101Node = await renderGroup(T31101);

    contentEl.appendChild(socNode);
    contentEl.appendChild(bioNode);
    contentEl.appendChild(e31101Node);
    contentEl.appendChild(t31101Node);

    statusEl.textContent = 'Done.';
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Error loading documents.';
    contentEl.innerHTML = '<div style="color:#c00;font-weight:700">เกิดข้อผิดพลาดในการโหลดเอกสาร</div>';
  }
}

// ====== Toolbar actions ======
reloadBtn.addEventListener('click', renderAll);

dlHtmlBtn.addEventListener('click', () => {
  const blob = new Blob(
    [
      '<!doctype html><meta charset="utf-8">',
      '<link href="https://fonts.googleapis.com/css2?family=Niramit:wght@400;700&display=swap" rel="stylesheet">',
      '<style>',
      'body{font-family:Niramit,system-ui,-apple-system,Segoe UI,Arial,sans-serif;line-height:1.8;padding:24px;max-width:1100px;margin:0 auto}',
      '#content h1{text-align:left;font-size:28px} #content h2{text-align:left;font-size:24px} #content h3{text-align:left;font-size:20px}',
      '.major-heading{font-size:26px;font-weight:700;margin:0 0 12px 0;padding:10px 14px;border-radius:10px;background:#eef2f6}',
      '.doc-heading{font-size:22px;font-weight:700;margin:0 0 12px 0;padding:8px 12px;border-radius:10px;background:#f4f4f4}',
      '</style>',
      contentEl.innerHTML
    ],
    { type: 'text/html;charset=utf-8' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'รวม_สังคมศึกษา+ชีววิทยา+E31101+ท31101_ม.4_1-68.html';
  a.click();
  URL.revokeObjectURL(url);
});

// ====== Side menu ======
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

// Init
document.addEventListener('DOMContentLoaded', renderAll);