(function () {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (!sessionId) {
    document.querySelectorAll('.no-payed-user').forEach(el => el.classList.remove('hide'));
    document.querySelectorAll('.payed-user').forEach(el => el.remove());
    document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());
    return;
  }

  document.querySelectorAll('.payed-user-wait').forEach(el => el.classList.remove('hide'));

  // ========== FETCH DATA FROM WEBHOOK ==========
  const WEBHOOK_URL = 'https://celerart.app.n8n.cloud/webhook/onboarding-form-request';

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
      console.log('Webhook response:', data);

      document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());

      // ========== AUTO-FILL DATA START ==========
      var readonlyFields = {
        'First-name': data['firstName'],
        'Last-name': data['lastName'],
        'Email': data['email'],
        'business-facility-name': data['businessName'],
        'Selected-plan': data['plan']
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

      document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));

      // ========== FORM SUBMIT ==========
      var form = document.getElementById('wf-form-Onboarding');
      if (form) {
        form.addEventListener('submit', function () {
          var formData = new FormData(form);
          var payload = {};
          formData.forEach(function (value, key) { payload[key] = value; });
          payload['session_id'] = sessionId;

          fetch('https://celerart.app.n8n.cloud/webhook/onboarding-form-submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(payload)
          }).catch(function (err) {
            console.error('Form submit webhook failed:', err);
          });
        });
      }
      // ========== FORM SUBMIT END ==========
    })
    .catch(function (err) {
      console.error('Webhook fetch failed:', err);
      document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());
      document.querySelectorAll('.payed-user').forEach(el => el.remove());
      document.querySelectorAll('.payed-user-denied').forEach(el => el.classList.remove('hide'));
    });
})();
