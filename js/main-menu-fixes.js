/* main-menu-fixes.js */
(function() {
  // 1) 設定 --vh 以避免 100vh 在 mobile 上被地址列干擾
  function setVh(){
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);
})();

(function() {
  // 2) 控制 menu 開關時 body 的 state
  // 確保 selector 與你的主題相符：.menu input[type=checkbox]
  function initMenuState() {
    var checkbox = document.querySelector('.menu input[type=checkbox]');
    if (!checkbox) return;

    var updateBodyState = function() {
      if (checkbox.checked) {
        document.body.classList.add('no-scroll');
        document.body.classList.add('menu-open');
        // optional: focus first menu link for accessibility
        var firstLink = document.querySelector('.menu .menu-link, .menu a');
        if (firstLink && typeof firstLink.focus === 'function') firstLink.focus();
      } else {
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('menu-open');
      }
    };

    // 當 checkbox 狀態改變時更新
    checkbox.addEventListener('change', updateBodyState);

    // 若用 JS 關閉選單（例如點選連結後），同步更新
    document.addEventListener('click', function(e) {
      var target = e.target;
      // 如果點到 menu 裡的連結並且 checkbox 有被勾選，則關閉 menu（避免導航後 menu 留著）
      if (checkbox.checked && target.closest && target.closest('.menu')) {
        // 如果是 a.link 且有 href，延遲關閉讓導航發生（SPA 的話可能不同）
        var a = target.closest('a');
        if (a && a.getAttribute('href')) {
          checkbox.checked = false;
          updateBodyState();
        }
      }
    });

    // Esc 鍵關閉 menu（可改善可及性）
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (checkbox.checked) {
          checkbox.checked = false;
          updateBodyState();
        }
      }
    });

    // 初始化一次
    updateBodyState();
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuState);
  } else {
    initMenuState();
  }
})();