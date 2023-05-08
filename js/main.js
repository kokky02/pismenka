
/**
 * CONFIG
 */

// REMOVE ACCENTS
const noAccents = (str) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "")
}


// CONFETTI
let myConfetti = confetti.create(document.querySelector('canvas'), {
    resize: true,
    useWorker: true
})

myConfetti({
    particleCount: 100,
    spread: 160
})


// MICRO MODAL
MicroModal.init({
    disableFocus: true
})


/**
 * ANIMATIONS
 */

// ADD NEW LETTER
const animateTileBounce = (tile) => {
    tile.classList.add('is-filled', 'animate__animated', 'animate__bounceIn')
}


// SUBMIT NON-EXISTANT WORD
const animateRowShake = (row) => {
    row.classList.remove('animate__shakeX')

    setTimeout(() => {
        row.classList.add('animate__animated', 'animate__shakeX')
    }, 0)
}


// SUBMIT EXISTING WORD
const animateTileReveal = (row) => {
    row.querySelectorAll('.tile').forEach((tile, index) => {
        tile.classList.remove('animate__bounceIn', 'animate__flipInY')

        setTimeout(() => {
            tile.style.visibility = 'visible'
            tile.classList.add('animate__flipInY', `animate__delay-${index}s`)
        }, 0)
    })
}


// CORRECT WORD!!
const animateTileDance = (row) => {
    row.querySelectorAll('.tile').forEach((tile, index) => {
        tile.innerHTML = solution.charAt(index)
        tile.classList.remove('animate__bounceIn', 'animate__flipInY', 'animate__bounce')

        setTimeout(() => {
            tile.classList.add('animate__bounce', `animate__delay-${index}s`)
        }, 0)
    })
}


// HIGHLIGHT LETTERS
const highlightLetters = () => {
    let rowTiles = currentRow().querySelectorAll(".tile")
    let lettersToCheck = noAccentSolution.split('')

    // first we find all 'correct' letters
    rowTiles.forEach((tile, index) => {
        tile.style.visibility = "hidden"

        let letter = noAccents(word.charAt(index))

        if (lettersInRow.correct.some(o => o.letter === letter && o.index === index)) {
            tile.classList.add('correct')
            lettersToCheck[index] = null
        }
    })

    // then we check for 'present' and 'wrong'
    rowTiles.forEach((tile, index) => {
        tile.style.visibility = "hidden"

        let letter = noAccents(word.charAt(index))
        let colorClass = "wrong"

        if (lettersInRow.present.some(o => o.letter === letter && o.index === index)) {
            if (lettersToCheck.includes(letter)) {
                colorClass = 'present'
                lettersToCheck[lettersToCheck.indexOf(letter)] = null
            }
        }

        tile.classList.add(colorClass)
    })


    // aplhabet row in footer
    document.querySelectorAll(".keyboard .tile").forEach((tile, index) => {
        let colorClass = ""

        if (lettersInRow.wrong.some(o => o.letter === tile.id)) colorClass = "wrong"
        if (lettersInRow.present.some(o => o.letter === tile.id)) colorClass = "present"
        if (lettersInRow.correct.some(o => o.letter === tile.id)) colorClass = "correct"

        if (colorClass) {
            setTimeout(() => tile.classList.add(colorClass), 1400)
        }
    })
}


// FADE OUT KEYBOARD
const fadeOutKeyboard = (variant, delay) => {
    let keyboardDelay = delay || 2500
    let keyboardButtons = document.querySelectorAll('.keyboard .row .tile')

    // fade out all keys
    setTimeout(() => {
        // if you win, keys fade out nicely
        if (variant === 'win') {
            keyboardButtons.forEach(tile =>
                tile.classList.add('animate__animated', 'animate__fadeOutDown')
            )
        }
        // if you lose, keys fall out erratically
        else if (variant === 'lose') {
            keyboardButtons.forEach(tile => {
                let chance = Math.floor(Math.random() * 5) + 1
                tile.classList.add('animate__animated', 'animate__fadeOutDownBig', `animate__delay-${chance}s`)
            })
        }
    }, keyboardDelay)
}


// FADE IN "PLAY AGAIN" BUTTON
const fadeInPlayAgainButton = (delay) => {
    let buttonDelay = delay || 2750

    // again button
    let winnerButton = document.querySelector('.keyboard .winner')

    setTimeout(() => {
        winnerButton.style.display = 'flex'
        winnerButton.classList.add('animate__animated', 'animate__fadeIn')
    }, buttonDelay)
}


/**
 * TOOLTIPS
 */

const tooltipElement = document.querySelector('.tooltip')

const tooltip = (text, forever) => {
    if (!text) return

    tooltipElement.innerHTML = text
    tooltipElement.className = 'tooltip animate__animated'

    // fade in tooltip
    setTimeout(() => {
        tooltipElement.classList.add('animate__fadeIn')
    }, 0)

    // fade out tooltip
    if (!forever) {
        setTimeout(() => {
            tooltipElement.className = 'tooltip animate__animated'
            tooltipElement.classList.add('animate__fadeOut')
        }, 2500)
    }
}

// UNKNOWN WORD TOOLTIP
const tooltipUnknownWord = () => {
    let lastLetter = word.slice(-1).toLowerCase()

    if (['y', 'i'].includes(lastLetter)) {
        tooltip('Nejsou zde žádná přídavná jména, slovesa, množná čísla, ani jména.')
    }
    else {
        tooltip('Toto slovo neznám <br> ¯\\\_(ツ)_/¯')
    }
}

// TOOLTIP - YOU WON
const tooltipHellYeah = () => {
    setTimeout(() => {
        if (tries === 1) tooltip('🔥WOW!🔥 <br> jsi prostě NEJLEPŠÍ')
        else if (tries === 2 || tries === 3) tooltip('PARÁDA! 😉')
        else if (tries === 4 || tries === 5) tooltip('máš to! 👍')
        else if (tries === 6) tooltip('uff, to bylo byle těsně! ')
    }, 1500)
}


/**
 * APP.JS
 */

// DATA
const maxWordLength = 5
const maxTries = 6

let solution = allWordsCS[(allWordsCS.length * Math.random()) | 0].toLowerCase()
let word = ""
let tries = 1

// no accents (pre slovencinu)
let noAccentWords = allWordsCS.map((x) => noAccents(x))
let noAccentSolution = noAccents(solution)

let canSubmit = true
let gameEnded = false

let lettersInRow = {
    correct: [],
    present: [],
    wrong: [],
}

// TILE TO UPDATE
const currentTile = () => {
    return currentRow().querySelector(`:nth-child(${word.length})`)
}

// ROW WE'RE PLAYING IN
const currentRow = () => {
    return document.querySelector(`.board .row:nth-of-type(${tries})`)
}

// KEY PRESS
document.addEventListener("keydown", (event) => {
    // de-focus any active element (needed for micromodal)
    if ("activeElement" in document) document.activeElement.blur()

    // nope
    if (gameEnded) return

    if (event.key === "Enter") {
        submitWord()
    } else if (event.key === "Backspace") {
        removeLetter()
    } else {
        addLetter(event.key)
    }
})

// SUBMIT
const submitWord = () => {
    if (word.length < maxWordLength) return
    if (!canSubmit) return

    // is this a real word ?
    if (!noAccentWords.includes(noAccents(word))) {
        animateRowShake(currentRow())
        tooltipUnknownWord()
        return
    }

    findLettersInRow()
    highlightLetters()
    animateTileReveal(currentRow())

    // can't submit again, while animations are running
    canSubmit = false

    // wait for reveal animation to finish
    setTimeout(judgeResult, 1500)
}

// ADD LETTER
const addLetter = (character) => {
    if (word.length >= maxWordLength) return

    // allow only letters
    if (/^\p{L}$/u.test(character)) {
        word = word + character
        word = word.toLowerCase()

        let tile = currentTile()
        tile.innerHTML = character

        animateTileBounce(tile)
    }
}

// REMOVE LETTER
const removeLetter = () => {
    if (word.length <= 0) return

    let tile = currentTile()
    tile.innerHTML = ""
    tile.className = "tile"

    word = word.slice(0, -1)
}

// JUDGE RESULT
const judgeResult = () => {
    canSubmit = true

    if (noAccents(word) === noAccentSolution) {
        youWin()
    } else if (tries >= maxTries) {
        youLose()
    } else {
        youTryAgain()
    }
}

// YOU WIN
const youWin = () => {
    gameEnded = true

    animateTileDance(currentRow())
    setTimeout(() => confetti(), 1500)
    tooltipHellYeah()
    fadeOutKeyboard('win')
    fadeInPlayAgainButton()
}

// YOU LOSE
const youLose = () => {
    gameEnded = true

    fadeOutKeyboard('lose', 100)
    fadeInPlayAgainButton(1000)
    setTimeout(() => {
        tooltip(`<small>Tvé řešení bylo:</small> <strong>${solution.toUpperCase()}</strong>`, true)
    }, 750)
}

// YOU TRY AGAIN
const youTryAgain = () => {
    word = ""
    tries++
}

// FIND LETTERS IN ROW
const findLettersInRow = () => {
    let present = []
    let correct = []
    let wrong = []

        ;[...word].forEach((letter, index) => {
            letter = noAccents(letter)

            // letter in correct place
            if (letter === noAccentSolution.charAt(index)) {
                correct.push({ letter: letter, index: index })
            }
            // letter in wrong place
            else if (noAccentSolution.includes(letter)) {
                present.push({ letter: letter, index: index })
            }
            // wrong letter
            else {
                wrong.push({ letter: letter, index: index })
            }
        })

    lettersInRow = {
        present,
        correct,
        wrong,
    }
}

// MOBILE
const keyboard = document.querySelector('.keyboard')
keyboard.addEventListener('click', (event) => {
    // clicked on button?
    if (event.target.nodeName !== 'BUTTON') return

    let character = event.target.id

    if (gameEnded && character === 'again') {
        window.location.reload()
    }
    else if (character === '↵') {
        submitWord()
    }
    else if (character === '←') {
        removeLetter()
    }
    else {
        addLetter(character)
    }
})




