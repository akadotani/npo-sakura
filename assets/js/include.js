function includeHTML(id, url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback();
    });
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML('header', 'header.html', function() {
    // headerの読み込みが終わった後に実行
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', function() {
        nav.classList.toggle('open');
        document.body.classList.toggle('menu-open');
      });
      // メニュー内リンククリックで自動的に閉じる
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          document.body.classList.remove('menu-open');
        });
      });
    }
  });
  includeHTML('footer', 'footer.html');
}); 
