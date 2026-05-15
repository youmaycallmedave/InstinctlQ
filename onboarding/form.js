(function () {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (!sessionId) {
    // Нет session_id — показываем контент для незаплативших, убираем остальное
    document.querySelectorAll('.no-payed-user').forEach(el => el.classList.remove('hide'));
    document.querySelectorAll('.payed-user').forEach(el => el.remove());
    document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());
    return;
  }

  // Есть session_id — показываем лоадер, делаем запрос
  document.querySelectorAll('.payed-user-wait').forEach(el => el.classList.remove('hide'));

  // ========== FETCH DATA FROM WEBHOOK ==========
  const WEBHOOK_URL = 'https://celerart.app.n8n.cloud/webhook-test/contact-form-submit';

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ session_id: sessionId })
  })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      // ========== FETCH DATA END ==========

      // Убираем лоадер
      document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());

      // ========== AUTO-FILL DATA START ==========
      var readonlyFields = {
        'First-name': data['First-name'],
        'Last-name': data['Last-name'],
        'Email': data['Email'],
        'business-facility-name': data['business-facility-name'],
        'Selected-plan': data['Selected-plan']
      };

      Object.entries(readonlyFields).forEach(function (entry) {
        var field = document.getElementById(entry[0]);
        if (field && entry[1]) field.value = entry[1];
      });
      // ========== AUTO-FILL DATA END ==========

      document.querySelectorAll('[data-readonly="true"]').forEach(function (field) {
        field.readOnly = true;
        field.classList.add('is-readonly');
      });

      // Показываем форму
      document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));
    })
    .catch(function (err) {
      console.error('Webhook fetch failed:', err);
      // Убираем лоадер даже при ошибке, показываем форму пустой
      document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());
      document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));
    });
})();
