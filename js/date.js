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

/**
 * 
 * @param {Date} date 
 */
function formatDate(date) {
     const DAYS = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota']
     const MONTHS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec']

     return `${DAYS[date.getDay()]}, ${date.getDate()}. ${MONTHS[date.getMonth()]}`

}

setInterval(() => {
     const now = new Date();

     timeElement.textContent = formatTime(now);
     dateElement.textContent = formatDate(now);
}, 200);
