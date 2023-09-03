const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.date');


/**
 * 
 * @param {Date} date 
 */
function formatTime(date) {
     const hours12 = date.getHours()
     const minutes = date.getMinutes();
     

     return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}