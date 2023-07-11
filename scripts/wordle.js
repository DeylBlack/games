let attempt = 0;
let letterCount = 0;
let guessWord = '';
let wordLength = 0;
const keyboard = document.getElementById('keyboard');

function createKeyboard() {
    keyboardButtons.forEach((keyBoardItem) => {
        const button = document.createElement('button');
        button.id = keyBoardItem.toLowerCase()

        button.innerText = keyBoardItem;

        if (keyBoardItem === 'ENTER') {
            button.style.gridColumn = '2';
            button.style.gridColumnStart = '1';
            button.classList.add('enter')
            // button.style.position = 'absolute';
            // button.style.bottom = '0';
            // button.style.left = '0';
            // button.style.width = '90px';
        }

        if (keyBoardItem === 'BACKSPACE') {
            const img = document.createElement('i')
            img.className = 'fa-solid fa-delete-left';
            button.classList.add('backspace')
            button.innerText = '';

            // button.style.position = 'absolute';
            // button.style.bottom = '0';
            // button.style.right = '0';
            // button.style.width = '90px';
            // button.style.fontSize = '12px';
            // button.style.display = 'flex';
            // button.style.flexDirection = 'column';
            // button.style.alignItems = 'center';
            // button.style.justifyContent = 'center';
            button.append(img)
        }

        if (keyBoardItem === 'X') {
            button.style.gridColumnStart = '3';
        }


        button.addEventListener('click', (ev) => {
            switch (ev.srcElement.innerText) {
                case '':
                    deleteLetter();
                    break;
                case 'ENTER':
                    sendWordToCheck();
                    break;
                default:
                    pushLetter(ev.srcElement.innerText);
            }
        });
        keyboard.append(button);
    })
}

function listenCurrentCell() {
    // const currentCell = document.getElementById('cell' + attempt + letterCount);
    //
    // currentCell.classList.add('current')
}

function keyboardListener() {
    document.addEventListener('keydown', (event) => {
        if (keyboardButtons.includes(event.key.toUpperCase())) {
            console.log(event.key.toUpperCase())
            switch (event.key.toUpperCase()) {
                case 'BACKSPACE':
                    deleteLetter();
                    break;
                case 'ENTER':
                    sendWordToCheck();
                    break;
                default:
                    pushLetter(event.key.toUpperCase());
            }
        }
    })
}

function createBoard() {
    fetch('https://random-word-api.vercel.app/api?words=1&length=5')
        .then((word) => {
            word.json().then((res) => {
                console.log(res)
                guessWord = res;

                const board = document.getElementById('board');

                for (let i = 0; i <= 5; i++) {
                    const boardLine = document.createElement('div');
                    boardLine.className = 'line'
                    boardLine.id = `line ${i}`
                    for (let j = 0; j <= 4; j++) {
                        const boardCell = document.createElement('div')
                        boardCell.className = 'cell'
                        boardCell.id = 'cell-' + j;

                        boardCell.addEventListener('click', (ev) => {
                            if (ev.srcElement.innerText) {
                                deleteLetter()
                            }
                        })

                        boardLine.append(boardCell);
                    }

                    board.append(boardLine)
                }

                keyboardListener();
                listenCurrentCell();

                createKeyboard();
            })
        })
}

function checkCurrentWord(word, cell) {
    if (word === guessWord) {
        console.log('YOU ARE WIN')
    }

    word.split('').map((letter, index) => {
        const keyboardLetter = document.getElementById(letter);

        if (letter === guessWord.toString()[index]) {
            cell[index].style.background = '#89ce00';
            keyboardLetter.style.background = '#89ce00';
        } else if (guessWord.toString().includes(letter) && letter !== guessWord[index]) {
            cell[index].style.background = '#FFD700'
            keyboardLetter.style.background = '#FFD700';
        } else {
            cell[index].style.background = '#727C85'
            keyboardLetter.style.background = '#727C85';
        }
    });

    // TODO add message that game is over
    if (attempt === 5 && letterCount === 5) {
        console.log('YOU ARE LOSE')
    }
}

function getCurrentWord(currentWord) {
    let word = '';

    for (let letter of currentWord) {
        if (letter.innerText) {
            word += letter.innerText;
        }
    }

    return word.toLowerCase();
}

function deleteLetter() {
    if (wordLength === 0) {
        return;
    }
    const currentLine = document.getElementById('line ' + attempt);
    currentLine.children[wordLength - 1].innerText = '';
    if (currentLine.children[wordLength - 1].className.includes('scale')) {
        currentLine.children[wordLength - 1].classList.remove('scale')
    }

    letterCount--;
    wordLength--;
}

function sendWordToCheck() {
    const currentLine = document.getElementById('line ' + attempt);

    if (wordLength === 5) {
        fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + getCurrentWord(currentLine.children))
            .then((result) => {
                if (result.ok) {
                    console.log(guessWord, 'STOP')
                    console.log(getCurrentWord(currentLine.children))
                    checkCurrentWord(getCurrentWord(currentLine.children), currentLine.children);
                    attempt++;
                    currentLine.classList.add('disabled')
                    wordLength = 0;
                } else {
                    for (let child of currentLine.children) {
                        child.innerText = '';
                        wordLength = 0;
                    }
                }
                wordLength = 0;
                for (let i = 0; i <= 5; i++) {
                    if (currentLine.children[i].className.includes('scale')) {
                        currentLine.children[i].classList.remove('scale')
                    }
                }
            })
            .catch(() => {
                console.log('ERROR')
                wordLength = 0;

            })
    }
}

function pushLetter(letter) {
    if (wordLength >= 5) {
        return;
    }
    wordLength++;

    const currentLine = document.getElementById('line ' + attempt);

    currentLine.children[wordLength - 1].innerText = letter;
    currentLine.children[wordLength - 1].classList.add('scale')

    letterCount++;

    if (letterCount === 5) {
        letterCount = 0;
    }
}

createBoard();
