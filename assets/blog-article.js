(function() {
  var WX_ID = 'jiage01888';
  var toast = document.getElementById('toast');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    window.setTimeout(function() { toast.classList.remove('show'); }, 1600);
  }

  function fallbackCopy(text) {
    var input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    input.remove();
    return Promise.resolve();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function() {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  document.querySelectorAll('[data-copy-wx]').forEach(function(button) {
    button.addEventListener('click', function() {
      copyText(WX_ID)
        .then(function() { showToast('已复制微信：' + WX_ID); })
        .catch(function() { showToast('请手动添加微信：' + WX_ID); });
    });
  });
})();
