(function () {
  const PLAN_LIMITS = {
    'Small (1-15 staff)':   15,
    'Medium (16-30 staff)': 30,
    'Large (31–50 staff)':  50,
  };

  // ========== STYLES ==========
  var style = document.createElement('style');
  style.textContent = [
    '.contact_add-btn.is-disabled {',
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '  pointer-events: none;',
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
    '.contact_form-row-delete.is-disabled {',
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '  position: relative;',
    '}',
    '.contact_form-row-delete.is-disabled:hover::after {',
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
    updateDeleteBtns();
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
        name:   name     ? name.value.trim()  : '',
        email:  email    ? email.value.trim() : '',
        role:   role     ? role.value         : '',
        access: usertype ? usertype.value     : '',
      });
    });
    resultInput.value = JSON.stringify(members, null, 2);
    updateAddBtn();
  }

  function updateDeleteBtns() {
    if (!list) return;
    var items = list.querySelectorAll('.contact_add-group-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.contact_form-row-delete');
      if (btn) {
        if (items.length <= 1) {
          btn.classList.add('is-disabled');
          btn.setAttribute('data-tooltip', 'Minimum 1 user required');
        } else {
          btn.classList.remove('is-disabled');
          btn.removeAttribute('data-tooltip');
        }
      }
    });
  }

  function attachDeleteBtn(item) {
    const deleteBtn = item.querySelector('.contact_form-row-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        if (deleteBtn.classList.contains('is-disabled')) return;
        item.remove();
        collectJSON();
        updateDeleteBtns();
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
      updateDeleteBtns();
    });
  }

  // ========== FORM STAFF VALIDATION ==========
  var submitErrorMsg = null;

  function showSubmitError(text) {
    if (!submitErrorMsg) {
      submitErrorMsg = document.createElement('div');
      submitErrorMsg.className = 'contact_submit-error';
      submitErrorMsg.style.cssText = 'color:#c00;font-size:14px;margin-top:8px;';
      var btnWrap = document.querySelector('.contact_form-btn-wrap');
      if (btnWrap) btnWrap.appendChild(submitErrorMsg);
    }
    submitErrorMsg.textContent = text;
    submitErrorMsg.style.display = '';
  }

  function hideSubmitError() {
    if (submitErrorMsg) submitErrorMsg.style.display = 'none';
  }

  function ensurePeriod(text) {
    if (!text) return text;
    return /[.!?]$/.test(text.trim()) ? text : text.trim() + '.';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function linkifyEmails(text) {
    if (!text) return '';
    var emailRegex = /[^\s@,]+@[^\s@,]+\.[^\s@,]{2,}/g;
    var result = '';
    var lastIndex = 0;
    var match;
    while ((match = emailRegex.exec(text)) !== null) {
      result += escapeHtml(text.slice(lastIndex, match.index));
      result += '<a href="mailto:' + match[0] + '" class="text-color-primary-deep text-style-link">' + match[0] + '</a>';
      lastIndex = emailRegex.lastIndex;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  }

  function setMsg(el, text) {
    if (!el) return;
    el.innerHTML = linkifyEmails(text);
  }

  var earlyForm = document.getElementById('wf-form-Onboarding');
  if (earlyForm) {
    earlyForm.addEventListener('submit', function (e) {
      var csvMode = document.querySelector('.contact_add-file') &&
                    document.querySelector('.contact_add-file').style.display !== 'none';
      var value = resultInput ? resultInput.value.trim() : '';
      var valid = false;

      try {
        var parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          valid = parsed.some(function (u) { return (u.email || u.name || '').trim(); });
        }
      } catch (err) { valid = false; }

      if (!valid) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showSubmitError(csvMode
          ? 'The file you uploaded has no user information. Please fill it in and upload again.'
          : 'Please add at least one team member before submitting.');
        return;
      }
      hideSubmitError();
    }, true);
  }
  // ========== FORM STAFF VALIDATION END ==========

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

  var savedCsvData = null;

  function resetManualList() {
    if (!list || !template) return;
    list.querySelectorAll('.contact_add-group-item').forEach(function (item) { item.remove(); });
    var fresh = template.cloneNode(true);
    fresh.addEventListener('input', collectJSON);
    fresh.addEventListener('change', collectJSON);
    attachDeleteBtn(fresh);
    list.appendChild(fresh);
    updateDeleteBtns();
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.tabs_nav-toggle');
    if (!toggle) return;
    var addWrap = document.querySelector('.contact_add-wrap');
    var addFile = document.querySelector('.contact_add-file');
    if (!addWrap || !addFile) return;
    var isActive = toggle.classList.toggle('is-active');
    addWrap.style.display = isActive ? 'none' : '';
    addFile.style.display = isActive ? 'block' : 'none';

    if (isActive) {
      // Переход на CSV: сбрасываем ручной список, восстанавливаем сохранённые CSV данные
      resetManualList();
      if (resultInput) resultInput.value = savedCsvData || '';
      addWrap.querySelectorAll('[required]').forEach(function (f) { f.dataset.wasRequired = 'true'; });
      addWrap.querySelectorAll('[data-was-required]').forEach(function (f) { f.removeAttribute('required'); });
    } else {
      // Переход на ручной: сохраняем CSV данные, очищаем resultInput
      if (resultInput) savedCsvData = resultInput.value || null;
      resetManualList();
      if (resultInput) resultInput.value = '';
      addWrap.querySelectorAll('[data-was-required]').forEach(function (f) { f.setAttribute('required', ''); });
    }
  });
  // ========== TABS TOGGLE END ==========

  // ========== FILE PARSER (CSV / XLS / XLSX) ==========
  var csvFileInput = document.querySelector('.contact_add-file .w-file-upload-input')
                  || document.querySelector('.contact_add-file input[type="file"]');

  function splitCSVRow(row, delimiter) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < row.length; i++) {
      var c = row[i];
      if (c === '"' && row[i + 1] === '"') { current += '"'; i++; }
      else if (c === '"') { inQuotes = !inQuotes; }
      else if (c === delimiter && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += c; }
    }
    result.push(current.trim());
    return result;
  }

  function parseCSVText(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
    if (lines.length < 2) return null;

    var candidates = [',', ';', '\t', '|'];
    var delimiter = candidates.reduce(function (best, d) {
      return lines[0].split(d).length > lines[0].split(best).length ? d : best;
    });

    var rawHeaders = splitCSVRow(lines[0], delimiter);

    var keyPatterns = [
      { key: 'name',     pattern: /^(full.?name|name)$/i },
      { key: 'email',    pattern: /^e.?mail$/i },
      { key: 'role',     pattern: /^role$/i },
      { key: 'access',   pattern: /^(access|usertype|user.?type)$/i },
    ];

    var headers = rawHeaders.map(function (h) {
      var match = keyPatterns.find(function (kp) { return kp.pattern.test(h.trim()); });
      return match ? match.key : h.trim().toLowerCase().replace(/\s+/g, '_');
    });

    // Только Users-секция (строки с количеством колонок = заголовку)
    var colCount = rawHeaders.length;
    return lines.slice(1).filter(function (line) {
      return splitCSVRow(line, delimiter).length === colCount;
    }).map(function (line) {
      var cols = splitCSVRow(line, delimiter);
      var obj = {};
      headers.forEach(function (h, i) { obj[h] = cols[i] || ''; });
      return obj;
    }).filter(function (row) { return Object.values(row).some(function (v) { return v.trim(); }); });

    // Все секции (раскомментировать если нужно передавать все данные из файла)
    // return lines.slice(1).map(function (line) {
    //   var cols = splitCSVRow(line, delimiter);
    //   var obj = {};
    //   rawHeaders.forEach(function (h, i) { obj[h] = cols[i] || ''; });
    //   return obj;
    // }).filter(function (row) { return Object.values(row).some(function (v) { return v.trim(); }); });
  }

  if (csvFileInput && resultInput) {
    csvFileInput.addEventListener('change', function () {
      var file = csvFileInput.files && csvFileInput.files[0];
      if (!file) {
        savedCsvData = null;
        if (resultInput) resultInput.value = '';
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        var data = parseCSVText(e.target.result);
        if (data) {
          resultInput.value = JSON.stringify(data);
          console.log('Parsed CSV:', data);
        }
      };
      reader.readAsText(file);
    });

    // Удаление файла через Webflow кнопку — change не срабатывает, слушаем кнопку
    document.addEventListener('click', function (e) {
      if (e.target.closest('.w-file-remove-link')) {
        savedCsvData = null;
        resultInput.value = '';
      }
    });
  }
  // ========== FILE PARSER END ==========

  // ========== SESSION ==========
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (!sessionId) {
    document.querySelectorAll('.payed-user').forEach(el => el.classList.remove('hide'));
    var successText = document.querySelector('.success-form-change');
    if (successText) successText.textContent = 'We will create your staff accounts soon. If in 24 hours your team still can\'t log in, please contact us at';
    var successBtn = document.querySelector('.form_success-btn');
    if (successBtn) successBtn.style.display = 'none';
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
      return response.json().then(function (body) { return { ok: response.ok, body: body }; });
    })
    .then(function (result) {
      if (!result.ok) {
        var errMsg = result.body.message || result.body.error || '';
        console.error('Webhook fetch failed:', result.body);
        document.querySelectorAll('.payed-user-wait').forEach(function (el) { el.remove(); });
        document.querySelectorAll('.payed-user').forEach(function (el) { el.remove(); });
        document.querySelectorAll('.payed-user-denied').forEach(function (el) { el.classList.remove('hide'); });
        var errorText = document.querySelector('.contact_error-text');
        if (errorText && errMsg) setMsg(errorText, ensurePeriod(errMsg));
        return;
      }
      var data = result.body;
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
        if (!field || !entry[1]) return;
        if (field.tagName === 'SELECT') {
          var val = entry[1].toLowerCase();
          var match = Array.from(field.options).find(function (opt) {
            return opt.value.toLowerCase().indexOf(val) === 0 || val.indexOf(opt.value.toLowerCase()) === 0;
          });
          if (match) field.value = match.value;
        } else {
          field.value = entry[1];
        }
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

      // Устанавливаем ссылку на кнопку Log In из branch_name и показываем её
      if (data['branch_name']) {
        var loginUrl = 'https://' + data['branch_name'] + '/';
        var successBtnWrap = document.querySelector('.form_success-btn');
        var loginBtn = successBtnWrap ? successBtnWrap.querySelector('a') : null;
        if (loginBtn) loginBtn.href = loginUrl;
        if (successBtnWrap) successBtnWrap.style.display = '';
      }

      updateAddBtn();

      // ========== FORM SUBMIT ==========
      var form = document.getElementById('wf-form-Onboarding');
      if (form) {
        form.addEventListener('submit', function () {
          var successText = document.querySelector('.success-form-change');
          var successBtnWrap = document.querySelector('.form_success-btn');
          if (successText) setMsg(successText, 'Please wait, we\'re setting up your account...');
          if (successBtnWrap) successBtnWrap.style.display = 'none';

          var formData = new FormData(form);
          var payload = {};
          formData.forEach(function (value, key) { payload[key] = value; });
          payload['session_id'] = sessionId;

          fetch('https://celerart.app.n8n.cloud/webhook/onboarding-form-submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(payload)
          })
            .then(function (res) {
              var httpStatus = res.status;
              return res.json().then(function (body) { return { httpStatus: httpStatus, body: body }; });
            })
            .then(function (result) {
              var httpStatus = result.httpStatus;
              var res = result.body;
              console.log('Form submit response:', res);

              var successBtnWrap = document.querySelector('.form_success-btn');
              var loginBtn = successBtnWrap ? successBtnWrap.querySelector('a') : null;
              var errorText = document.querySelector('.contact_error-text');
              var successText = document.querySelector('.success-form-change');

              if (httpStatus === 502 || httpStatus === 500 || httpStatus === 422) {
                var msg = ensurePeriod(res.message || res.error || 'Something went wrong. Please contact us at support@instinctiq.com');
                setMsg(errorText, msg);
                setMsg(successText, msg);
                // кнопка остаётся скрытой
              } else if (httpStatus === 200) {
                if (res.status === 'failed' || res.code === 'STAFF_CREATION_PARTIAL') {
                  var partialMsg = ensurePeriod(res.message || 'Some accounts were created with issues. Please contact us at support@instinctiq.com');
                  setMsg(errorText, partialMsg);
                  setMsg(successText, partialMsg);
                  // кнопка остаётся скрытой при частичном фейле
                } else if (res['branch_name']) {
                  // полный успех — показываем кнопку
                  var loginUrl = 'https://' + res['branch_name'] + '-instinctiq.talentlms.com/';
                  if (loginBtn) loginBtn.href = loginUrl;
                  if (successBtnWrap) successBtnWrap.style.display = '';
                  setMsg(successText, 'We will create your staff accounts soon. If in 24 hours your team still can\'t log in, please contact us at');
                }
              }
            })
            .catch(function (err) { console.error('Form submit webhook failed:', err); });
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
