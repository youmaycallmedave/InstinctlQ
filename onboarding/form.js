window.addEventListener('load', async function () {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (sessionId) {
    document.querySelectorAll('.no-payed-user').forEach(el => el.remove());
    document.querySelectorAll('.payed-user-wait').forEach(el => el.classList.remove('hide'));

    // ========== FETCH DATA FROM WEBHOOK ==========
    const WEBHOOK_URL = 'https://celerart.app.n8n.cloud/webhook-test/contact-form-submit';

    let data = {};
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
      data = await response.json();
    } catch (err) {
      console.error('Webhook fetch failed:', err);
    }
    // ========== FETCH DATA END ==========

    document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());

    // ========== AUTO-FILL DATA START ==========
    const readonlyFields = {
      'First-name': data['First-name'],
      'Last-name': data['Last-name'],
      'Email': data['Email'],
      'business-facility-name': data['business-facility-name'],
      'Selected-plan': data['Selected-plan']
    };

    Object.entries(readonlyFields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field && value) {
        field.value = value;
      }
    });
    // ========== AUTO-FILL DATA END ==========

    document.querySelectorAll('[data-readonly="true"]').forEach(field => {
      field.readOnly = true;
      field.classList.add('is-readonly');
    });

    document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));

  } else {
    document.querySelectorAll('.payed-user').forEach(el => el.remove());
    document.querySelectorAll('.payed-user-wait').forEach(el => el.remove());
  }
});
