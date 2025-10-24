/* main-menu-fixes.js - 更穩定版：設定 --vh 並在 resize/breakpoint 變動時同步關閉/開啟 menu */
(function() {
  // 設定 --vh
  function setVh(){
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);

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

    // 點 menu 裡連結時關閉（導航用）
    document.addEventListener('click', function(e){
      if (!document.body.classList.contains('menu-open')) return;
      var a = e.target.closest && e.target.closest('a');
      if (a && a.getAttribute('href') && a.closest('.menu')) {
        setTimeout(closeMenu, 50);
      }
    });

    // ESC 關閉
    document.addEventListener('keydown', function(e){
      if ((e.key === 'Escape' || e.key === 'Esc') && document.body.classList.contains('menu-open')) closeMenu();
    });

    // 當離開 mobile breakpoint 時強制關閉（避免殘留）
    function handleViewportChange(e) {
      if (!e.matches) closeMenu();
      else syncFromCheckbox();
    }
    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', handleViewportChange);
    else if (typeof mobileQuery.addListener === 'function') mobileQuery.addListener(handleViewportChange);

    // 初始化一次
    if (!mobileQuery.matches) closeMenu();
    else syncFromCheckbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuState);
  } else {
    initMenuState();
  }
})();