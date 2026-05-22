
  function showPopupItem(index) {
  var items = document.querySelectorAll('.team_popup-item');
  items.forEach(function(i) { i.classList.add('hide'); });
  items[index].classList.remove('hide');
}

function getCurrentIndex() {
  var items = document.querySelectorAll('.team_popup-item');
  for (var i = 0; i < items.length; i++) {
    if (!items[i].classList.contains('hide')) return i;
  }
  return 0;
}

document.querySelectorAll('.team6_item').forEach(function(item) {
  item.addEventListener('click', function() {
    var name = item.querySelector('.team_item-name').textContent.trim().toLowerCase();
    var items = document.querySelectorAll('.team_popup-item');

    items.forEach(function(popupItem) { popupItem.classList.add('hide'); });

    items.forEach(function(popupItem) {
      var popupName = popupItem.querySelector('.team_popup-item-name');
      if (popupName && popupName.textContent.trim().toLowerCase() === name) {
        popupItem.classList.remove('hide');
      }
    });
  });
});

document.querySelector('.team_popup').addEventListener('click', function(e) {
  var items = document.querySelectorAll('.team_popup-item');
  var total = items.length;
  var current = getCurrentIndex();

  if (e.target.closest('[data-swiper-next]')) {
    showPopupItem((current + 1) % total);
  } else if (e.target.closest('[data-swiper-prev]')) {
    showPopupItem((current - 1 + total) % total);
  }
});
