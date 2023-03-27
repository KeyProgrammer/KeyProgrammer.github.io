// Warsta logiczna gry
class Game {
    fields;

    gameActive;

    currentMode = null; // null = pvp

    activePlayer = 'X'; // domyślnie X

    winningTable = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];

    constructor() {
      this.board = new GameBoard(this.handleItemClick, this.setDefaultSettings, this.handleModeChange, this.handleCharChange);
      this.setDefaultSettings();
    }

    GameVlidate = () => {
      let gameWon = false;

      for (const element of this.winningTable) {
        const [fistPostion, secondPostion, thirdPostion] = element; // destrukturyzacja tablicy

        const fistFiledValue = this.fields[fistPostion];
        const secondFiledValue = this.fields[secondPostion];
        const thirdFiledValue = this.fields[thirdPostion];

        if (fistFiledValue !== '' && secondFiledValue !== '' && thirdFiledValue !== '') {
          if (fistFiledValue === secondFiledValue && secondFiledValue === thirdFiledValue
                    && thirdFiledValue === fistFiledValue) {
            gameWon = true;
            break;
          }
        }
      }

      if (gameWon) {
        this.gameActive = false;
        this.board.displayWinMessage(this.activePlayer);
      } else if (this.isBoardFull()) {
        this.gameActive = false;
        this.board.displayDrawMessage();
      }
    };

    handleModeChange = (event) => {
      this.currentMode = this.getModeClassForName(event.target.value);
      this.board.RestartGame();
    };

    handleCharChange = (event) => {
      this.activePlayer = event.target.value;
      this.board.RestartGame();
    };

    handleItemClick = (event) => {
      const { position } = event.target.dataset; // destrukturyzacja wyciągamy pole postion z event.target.dataset

      if (this.gameActive && this.fields[position] === '') {
        this.makeMove(position);
        if (this.currentMode !== null && this.gameActive) {
          this.makeMove(this.currentMode.getMove(this.fields, this.activePlayer));
        }
        if (this.gameActive && this.currentMode === null) this.board.resultPanel.innerText = `Ruch Gracza ${this.activePlayer}`;
      }
    };

    makeMove = (position) => {
      this.fields[position] = this.activePlayer;
      this.board.getFieledForPosition(position).classList.add(`board__item--filled-${this.activePlayer}`);// dodanie klasy skorzystanie z templateString wstrzylowanie Javy
      this.GameVlidate(); // następuje walidacja
      this.activePlayer = this.activePlayer === 'X' ? 'O' : 'X'; // następuje zmiana gracza
    }

    setDefaultSettings = (SelectedChar) => {
      this.fields = ['', '', '', '', '', '', '', '', ''];
      this.gameActive = true;
      if (this.currentMode === null) this.board.resultPanel.innerText = `Ruch Gracza ${this.activePlayer}`;
    }

    isBoardFull = () => {
      let emptyElement = 0;
      this.fields.forEach((field) => {
        if (field === '') {
          emptyElement++;
        }
      });
      return (emptyElement === 0);
      // lub return (fields.find(field => field === "")) === undefinded;
    };

    getModeClassForName = (name) => {
      if (name === 'easy') {
        return new EasyMode();
      }
      return null;
    }
}
// interkacje z HTML (Obsługa wyglądu)
class GameBoard {
    // Pobieranie elementów z HTML: Poniżej pola klasy
    fieldsElements = document.querySelectorAll('.board__item'); // NodeLista elementów

    resultPanel = document.querySelector('.panel');

    restButton = document.querySelector('.reset-button');

    modeSelect = document.querySelector('#mode-select');

    charSelect = document.querySelector('#char-select');

    // Miejsce w którym kod wykonujemy przy tworzeniu klasy
    constructor(onItemClick, onButtonClick, onModeChange, onCharChange) {
      this.onButtonClick = onButtonClick; // przekazanie metody bo inaczej nie wykonamy onButtonClick() w RestartGame w definicji GameBoard
      // tzw. call back
      this.restButton.addEventListener('click', this.RestartGame);
      this.fieldsElements.forEach((field) => {
        field.addEventListener('click', onItemClick);
      });
      this.modeSelect.addEventListener('change', onModeChange);
      this.charSelect.addEventListener('change', onCharChange);
    } // Koniec Konstruktora.

    RestartGame = () => {
      this.resetBoard();
      this.onButtonClick();
    }

    // Metoda Klasy
    resetBoard = () => {
      this.fieldsElements.forEach((field) => {
        field.classList.remove('board__item--filled-X', 'board__item--filled-O');
      });
      this.resultPanel.innerText = '';
    };

    displayWinMessage = (activePlayer) => {
      this.resultPanel.innerText = `Gratulacje ${activePlayer}, Wygrałeś!`;
    };

    displayDrawMessage = () => {
      this.resultPanel.innerText = 'Remis!';
    };

    getFieledForPosition = (position) => this.fieldsElements[position];
}
const game = new Game();

// AI Easy
class EasyMode {
    getMove = (fields, player) => {
      const emptyIndexes = Object.entries(fields)
        .filter((fieldEntry) => fieldEntry[1] === '')
        .map((fieldEntry) => fieldEntry[0]);

      // filtrowania jak na steamach
      const randomPositionIndex = Math.floor(Math.random() * emptyIndexes.length);
      return emptyIndexes[randomPositionIndex];
    };
}