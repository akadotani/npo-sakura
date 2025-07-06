document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
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
}); 