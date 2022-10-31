
const cButtonClass = 'collapsible__button';
const cActiveClassName = 'collapsible__button--active';

const toggleCollapse = (tgt) => {
  tgt.classList.toggle(cActiveClassName);
  let content = tgt.nextElementSibling;
  let icon = tgt.firstElementChild;
  var hash = "#";
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    icon.style.transform = null;
    // set the hash to the nearest open collapsible if any
    let buttons = document.getElementsByClassName(cActiveClassName);
    if (buttons.length > 0) {
      hash += buttons[0].id;
    }
  } else {
    hash += tgt.id
    content.style.maxHeight = content.scrollHeight + "px";
    icon.style.transform = "rotate(90deg)";
  }
  history.replaceState(null, "", hash);
};

window.onload = (event) => {
  // uncollapse the hash if one was given
  if (window.location.hash) {
    let e = document.getElementById(window.location.hash.substring(1));
    if (e && e.classList.contains(cButtonClass)) {
      toggleCollapse(e);
    }
  }
};
