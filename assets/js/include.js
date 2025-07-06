function includeHTML(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => { document.getElementById(id).innerHTML = html; });
}
document.addEventListener('DOMContentLoaded', function() {
  includeHTML('header', 'header.html');
  includeHTML('footer', 'footer.html');
}); 