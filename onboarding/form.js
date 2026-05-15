(function () {
  const PLAN_LIMITS = { Small: 15, Medium: 30, Large: 50 };

  // ========== STYLES ==========
  var style = document.createElement('style');
  style.textContent = [
    '.contact_add-btn.is-disabled {',
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '  pointer-events: none;',
    '}',
    '.contact_add-btn.is-disabled {',
    '  position: relative;',
    '}',
    '.contact_add-btn.is-disabled::after {',
    '  content: attr(data-tooltip);',
    '  position: absolute;',
    '  top: 50%;',
    '  left: calc(100% + 8px);',
    '  transform: translateY(-50%);',
    '  background: #1a1a1a;',
    '  color: #fff;',
    '  font-size: 13px;',
    '  line-height: 1.4;',
    '  white-space: nowrap;',
    '  padding: 6px 10px;',
    '  border-radius: 6px;',
    '  pointer-events: none;',
    '  z-index: 100;',
    '}',
  ].join('\n');
  document.head.appendChild(style);
  // ========== STYLES END ==========

  // ========== ADD GROUP MEMBERS ==========
  const list = document.querySelector('.contact_add-group-list');
  const template = list ? list.querySelector('.contact_add-group-item') : null;
  const resultInput = document.querySelector('.contact_add-group-result-input');
  const addBtn = document.querySelector('.contact_add-btn');

  if (template) {
    template.remove();
    const initial = template.cloneNode(true);
    initial.addEventListener('input', collectJSON);
    initial.addEventListener('change', collectJSON);
    attachDeleteBtn(initial);
    list.appendChild(initial);
  }

  function getCurrentPlan() {
    const planField = document.getElementById('Selected-plan');
    return planField ? planField.value : '';
  }

  function updateAddBtn() {
    if (!addBtn || !list) return;
    const plan = getCurrentPlan();
    const limit = PLAN_LIMITS[plan];
    const count = list.querySelectorAll('.contact_add-group-item').length;

    if (limit && count >= limit) {
      addBtn.classList.add('is-disabled');
      addBtn.setAttribute('data-tooltip', 'Your plan does not allow adding more members');
    } else {
      addBtn.classList.remove('is-disabled');
      addBtn.removeAttribute('data-tooltip');
    }
  }

  function collectJSON() {
    if (!list || !resultInput) return;
    const members = [];
    list.querySelectorAll('.contact_add-group-item').forEach(function (item) {
      const name     = item.querySelector('input[name="Person-Name"]');
      const email    = item.querySelector('input[name="Person-Email"]');
      const role     = item.querySelector('select[name="Person-Role"]');
      const usertype = item.querySelector('select[name="Person-Usertype"]');
      members.push({
        name:     name     ? name.value.trim()  : '',
        email:    email    ? email.value.trim() : '',
        role:     role     ? role.value         : '',
        usertype: usertype ? usertype.value     : '',
      });
    });
    resultInput.value = JSON.stringify(members, null, 2);
    updateAddBtn();
  }

  function attachDeleteBtn(item) {
    const deleteBtn = item.querySelector('.contact_form-row-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        item.remove();
        collectJSON();
      });
    }
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      const plan = getCurrentPlan();
      const limit = PLAN_LIMITS[plan];
      const count = list ? list.querySelectorAll('.contact_add-group-item').length : 0;
      if (limit && count >= limit) return;

      const clone = template.cloneNode(true);
      clone.addEventListener('input', collectJSON);
      clone.addEventListener('change', collectJSON);
      attachDeleteBtn(clone);
      list.appendChild(clone);
      collectJSON();
    });
  }

  // ========== EMAIL VALIDATION ==========
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function attachEmailValidation(input) {
    input.addEventListener('input', function () {
      input.setCustomValidity('');
    });
    input.addEventListener('blur', function () {
      const val = input.value.trim();
      if (val && !EMAIL_REGEX.test(val)) {
        input.setCustomValidity('Please enter a valid email (e.g. name@example.com)');
        input.reportValidity();
      } else {
        input.setCustomValidity('');
      }
    });
  }

  const mainEmail = document.getElementById('Email');
  if (mainEmail) attachEmailValidation(mainEmail);

  // Delegated validation for member email inputs
  if (list) {
    list.addEventListener('blur', function (e) {
      if (e.target && e.target.name === 'Person-Email') {
        const val = e.target.value.trim();
        if (val && !EMAIL_REGEX.test(val)) {
          e.target.setCustomValidity('Please enter a valid email (e.g. name@example.com)');
          e.target.reportValidity();
        } else {
          e.target.setCustomValidity('');
        }
      }
    }, true);

    list.addEventListener('input', function (e) {
      if (e.target && e.target.name === 'Person-Email') {
        e.target.setCustomValidity('');
      }
    });
  }
  // ========== EMAIL VALIDATION END ==========

  // Plan change guard — prevent switching to a plan that exceeds current member count
  const planField = document.getElementById('Selected-plan');
  if (planField) {
    let prevPlan = planField.value;
    planField.addEventListener('change', function () {
      const newPlan = planField.value;
      const limit = PLAN_LIMITS[newPlan];
      const count = list ? list.querySelectorAll('.contact_add-group-item').length : 0;
      if (limit && count > limit) {
        alert('To switch to the ' + newPlan + ' plan, you need to remove ' + (count - limit) + ' member(s). Please delete them before switching plans.');
        planField.value = prevPlan;
        return;
      }
      prevPlan = newPlan;
      updateAddBtn();
    });
  }
  // ========== ADD GROUP MEMBERS END ==========

  // ========== TABS TOGGLE ==========
  var tabStyle = document.createElement('style');
  tabStyle.textContent = '.contact_add-file { display: none; }';
  document.head.appendChild(tabStyle);

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.tabs_nav-toggle');
    if (!toggle) return;
    var addWrap = document.querySelector('.contact_add-wrap');
    var addFile = document.querySelector('.contact_add-file');
    if (!addWrap || !addFile) return;
    var isActive = toggle.classList.toggle('is-active');
    addWrap.style.display = isActive ? 'none' : '';
    addFile.style.display = isActive ? 'block' : 'none';
  });
  // ========== TABS TOGGLE END ==========

  // ========== SESSION ==========
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (!sessionId) {
    document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));
    var successText = document.querySelector('.success-form-change');
    if (successText) successText.textContent = 'We will create your staff accounts soon. If in 24 hours your team still can\'t log in, please contact us at';
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
        if (field.tagName === 'SELECT') {
          field.addEventListener('mousedown', function (e) { e.preventDefault(); });
          field.addEventListener('keydown', function (e) { e.preventDefault(); });
        } else {
          field.readOnly = true;
        }
        field.classList.add('is-readonly');
      });

      document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));

      updateAddBtn();

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
