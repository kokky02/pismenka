const btn = document.getElementById('btn');

function leftClick() {
  btn.style.left = '0';
  localStorage.setItem('buttonPosition', btn.style.left); // Saving the button position (left) value into localStorage
}

function rightClick() {
  btn.style.left = '50px';
  localStorage.setItem('buttonPosition', btn.style.left); // Saving the button position (right) value into localStorage
}

// Retrieving the stored value of the button position from localStorage after page loading
const savedButtonPosition = localStorage.getItem('buttonPosition');
if (savedButtonPosition) {
  btn.style.left = savedButtonPosition;
}

// Assign listeners to click events
btn.addEventListener('click', leftClick); // Left click
btn.addEventListener('contextmenu', rightClick); // Right click