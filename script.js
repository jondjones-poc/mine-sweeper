document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.getElementById('flags-left');
    const result = document.querySelector('#result');

    let width = 10;
    let bombCount = 20;
    let squares = [];
    let flags = 0;
    let isGameOver = false;

    flagsLeft.innerHTML = bombCount;

    const checkForWin = () => {
        let matches = 0

        for(let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombCount) {
                result.innerHTML = "You Win!";
                isGameOver = true;
            }
        }
    }

    const gameOver = () => {
        console.log('Game Over');

        isGameOver = true;

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerText = '💣';
            }
        })
    }

    const addFlag = square => {
        if (isGameOver) {
            return;
        }

        if (!square.classList.contains('checked') && (flags < bombCount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombCount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombCount - flags;
            }
        }
    }

    const checkSquare = (square, currentId) => {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = (currentId % width) === (width -1);
    
        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId > 10) {
                const newId = squares[parseInt(currentId -width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
    
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) +width].id;
  
            }
    
        }, 5)
    }
    
    const click = (square) => {
        let currentId = square.id;

        if (isGameOver) {
            return;
        }

        if (square.classList.contains('bomb')) {
            gameOver(square)
            return;
        } 
        
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked');
            square.innerHTML = total;
            return;
        }
    
        checkSquare(square, currentId);
        square.classList.add('checked');
    }

    const createBoard = () => {

        const bombArray = Array(bombCount).fill('bomb');
        const emptyArray = Array(width*width - bombCount).fill('valid');

        const gameArray = emptyArray.concat(bombArray);
        const shuffledArray = gameArray.sort(() => Math.random() -0.5);

        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', (e) => {
                click(square)
            })

            square.oncontextmenu = (e) => {
                e.preventDefault();
                addFlag(square);
            }
        }

        for(let i = 0; i < squares.length; i++) {
            const isLeftEdge = i % width === 0;
            const isRightEdge = (i % width) === (width -1);
            let total = 0;

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
                if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
                if (i < 89 && squares[i +width].classList.contains('bomb')) total ++

                squares[i].setAttribute('data', total);
            }
        }

    }

    createBoard()
})