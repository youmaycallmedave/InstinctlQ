const list = document.querySelector('.contact_add-group-list');
const template = list.querySelector('.contact_add-group-item');
const resultInput = document.querySelector('.contact_add-group-result-input');

template.remove();

function collectJSON() {
  const members = [];
  list.querySelectorAll('.contact_add-group-item').forEach(function(item) {
    const name     = item.querySelector('input[name="Person-Name"]');
    const email    = item.querySelector('input[name="Person-Email"]');
    const role     = item.querySelector('select[name="Person-Role"]');
    const usertype = item.querySelector('select[name="Person-Usertype"]');
    members.push({
      name:     name     ? name.value.trim()     : '',
      email:    email    ? email.value.trim()    : '',
      role:     role     ? role.value            : '',
      usertype: usertype ? usertype.value        : '',
    });
  });
  resultInput.value = JSON.stringify(members, null, 2);
}

document.querySelector('.contact_add-btn').addEventListener('click', function() {
  const clone = template.cloneNode(true);
  clone.addEventListener('input', collectJSON);
  clone.addEventListener('change', collectJSON);
  list.appendChild(clone);
  collectJSON();
});
