/* main-menu-fixes.js
   - 設定 --vh
   - 控制 menu 開關同步 body.no-scroll
   - 即時切換 dark/light，並把選擇存到 localStorage（不需重新載入）
*/
(function() {
  /* ===== 1) --vh 設定 ===== */
  function setVh(){
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);

  /* ===== 2) menu state 控制（保留並更穩健） ===== */
  function initMenuState() {
    var mobileQuery = window.matchMedia('(max-width: 768px)');
    var checkbox = document.querySelector('.menu input[type=checkbox]');
    var menuIcon = document.querySelector('.menu .menu-icon, .menu .menu-trigger');

    function closeMenu() {
      if (checkbox) checkbox.checked = false;
      document.body.classList.remove('no-scroll', 'menu-open');
    }
    function openMenu() {
      if (checkbox) checkbox.checked = true;
      document.body.classList.add('no-scroll', 'menu-open');
    }
    function syncFromCheckbox() {
      if (!checkbox) return;
      if (checkbox.checked) {
        document.body.classList.add('no-scroll', 'menu-open');
      } else {
        document.body.classList.remove('no-scroll', 'menu-open');
      }
    }

    if (checkbox) {
      checkbox.addEventListener('change', syncFromCheckbox);
    } else if (menuIcon) {
      menuIcon.addEventListener('click', function() {
        if (document.body.classList.contains('menu-open')) closeMenu(); else openMenu();
      });
    }

    // 點 menu 裡連結時自動關閉（較通用）
    document.addEventListener('click', function(e){
      if (!document.body.classList.contains('menu-open')) return;
      var a = e.target.closest && e.target.closest('a');
      if (a && a.getAttribute('href') && a.closest('.menu')) {
        setTimeout(closeMenu, 50);
      }
    });

    // ESC 鍵關閉
    document.addEventListener('keydown', function(e){
      if ((e.key === 'Escape' || e.key === 'Esc') && document.body.classList.contains('menu-open')) closeMenu();
    });

    // 當離開 mobile breakpoint 時強制關閉（避免殘留）
    function handleViewportChange(e) {
      if (!e.matches) closeMenu(); // e.matches === true 表示 <=768
      else syncFromCheckbox();
    }
    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', handleViewportChange);
    else if (typeof mobileQuery.addListener === 'function') mobileQuery.addListener(handleViewportChange);

    // 初始同步
    if (!mobileQuery.matches) closeMenu(); else syncFromCheckbox();
  }

  /* ===== 3) theme 切換（立刻生效，不需重新載入） =====
     - 會更新： documentElement(data-theme), body(data-theme), html/body class('dark'/'light')
     - 會更新： mode icon (.mode-moon / .mode-sunny) 顯示
     - 會存到 localStorage('theme')
  */
  function applyTheme(theme) {
    if (!theme) return;
    var html = document.documentElement;
    var body = document.body;

    // attribute
    html.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);

    // class fallback
    html.classList.remove('dark','light');
    body.classList.remove('dark','light');
    html.classList.add(theme);
    body.classList.add(theme);

    // 更新 mode button icon 顯示（常見結構）
    var modeEl = document.querySelector('.menu a#mode');
    if (modeEl) {
      var moon = modeEl.querySelector('.mode-moon');
      var sunny = modeEl.querySelector('.mode-sunny');
      if (theme === 'dark') {
        if (moon) moon.style.display = 'none';
        if (sunny) sunny.style.display = 'block';
      } else {
        if (moon) moon.style.display = 'block';
        if (sunny) sunny.style.display = 'none';
      }
    }

    // 更新 meta theme-color（手機地址列顏色）
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    if (theme === 'dark') meta.setAttribute('content', '#131418');
    else meta.setAttribute('content', '#ffffff');

    // 儲存
    try { localStorage.setItem('theme', theme); } catch(e){ /* ignore */ }
  }

  function initThemeToggle() {
    // load stored preference or system preference
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch(e){ stored = null; }
    var systemPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var initial = stored || systemPref;
    applyTheme(initial);

    // button handler
    var modeBtn = document.querySelector('.menu a#mode, .navbar .menu a#mode');
    if (modeBtn) {
      modeBtn.addEventListener('click', function(e){
        e && e.preventDefault && e.preventDefault();
        // toggle
        var cur = document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      }, {passive: false});
    }

    // If system preference changes and user hasn't explicitly stored a choice, follow it
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', function(e){
        var storedChoice = null;
        try { storedChoice = localStorage.getItem('theme'); } catch(ex) { storedChoice = null; }
        if (!storedChoice) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (err) { /* ignore on old browsers */ }
  }

  /* ===== DOM ready 初始化 ===== */
  function initAll() {
    initMenuState();
    initThemeToggle();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();