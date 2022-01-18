console.log('JS OK');
/* 
TRACCIA:
L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49

Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una b.

BONUS:
1- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste
2- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
*/

// # RANDOM NUM FUNCTION
function getRandomNumber(min, max) {
    Math.floor(Math.random() * (max - min + 1)) + min;
};

function play() {
    // Cambio testo al bottone
    playButton.innerText = 'Ricomincia';

    // Elimino il contenuto di grid
    grid.innerHTML = '';

    // # FASE PREPARATIVA
    // Settare le bombe
    let attempts = 0;
    // const bomb = '💣';
    const TOTAL_BOMBS = 16;

    // Raccolgo il val dalla tendina
    const level = document.getElementById('level').value;
    console.log(level);

    // Calcolo in base al lvl quante celle renderizzare
    let totalCells;
    let cellsPerRow;

    switch (level) {
        case 'easy':
            totalCells = 100; // 10
            break;
        case 'hard':
            totalCells = 49; // 7
            break;
        default:
            totalCells = 81; // 9
    }

    // Radice quadrata per calcolare le celle
    cellsPerRow = Math.sqrt(totalCells);
    console.log(cellsPerRow);

    // Inserisco una variabile per contare il punteggio
    const MAX_ATTEMPTS = totalCells - TOTAL_BOMBS;
    console.log(MAX_ATTEMPTS);


    // # FUNZIONI
    function generateBombs(totalBombs, totalNumbers) {
        // Genero le bombe
        let bombs = [];

        while (bombs.length < totalBombs) {
            let rndNumber = getRandomNumber(1, totalNumbers);
            if (!bombs.includes(rndNumber)) {
                bombs.push(rndNumber);
            }
        }
        return bombs;
    };

    function gameOver(bombs, points, isDefeat) {
        //Coloriamo le bombe
        showBombs(bombs);

        // Creo elemento per il messaggio
        const messageElement = document.createElement('h3')
        messageElement.className = 'message';

        // Decido il testo
        const messageText = isDefeat ? `Peccato, hai perso! Punteggio : ${points}` : 'Hai vinto! Gioca ancora..';
        messageElement.innerText = messageText;

        // Mostro l'elemento
        grid.appendChild(messageElement);
    };

    function showBombs(bombs) {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < cells.lenght; i++) {
            const cell = cells[i];
            const cellNumber = parseInt(cell.innerText);
            if (bombs.inlcludes(cellNumber)) cell.classList.add('bomb');
        }
    };

    function onCellClick(clickedCell, bombs, number) {
        // Impedisce altri futuri click sulla cella
        clickedCell.removeEventListener('click', onCellClick);

        // Controllo se è una bomba
        if (bombs.includes(number)) {
            gameOver(bombs, attempts, true)
        } else {
            clickedCell.classList.add('safe');
            attempts++;

            if (attempts === MAX_ATTEMPTS) {
                gameOver(bombs, attempts, false)
            }
        }
    };

    function generateGrid(cellsNumber, cellsPerRow, bombs) {
        // Renderizzo la griglia eassegno la classe
        for (let i = 1; i <= cellsNumber; i++) {
            const cell = generateCell(i, cellsPerRow);

            cell.addEventListener('click', (e) => onCellClick(e.target, bombs, i));

            grid.appendChild(cell);
        }
    };

    function generateCell(number, cellsPerRow) {
        // Genero le celle
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = number;
        const sideLenght = `calc(100% / ${cellsPerRow})`;
        cell.style.width = sideLenght;
        cell.style.height = sideLenght;

        return cell;
    };

    // ! ----------------------------
    // ! ESECUZIONE VERA E PROPRIA
    // ! ----------------------------
    const bombs = generateBombs(TOTAL_BOMBS, totalCells);
    console.log(bombs);
    generateGrid(totalCells, cellsPerRow, bombs);
};

// # RECUPERO GLI ELEMENTI
const playButton = document.getElementById('play');
const choice = document.getElementById('choice');
const grid = document.getElementById('grid');

// # Prendo il bottone e aggancio event listener
playButton.addEventListener('click', play);