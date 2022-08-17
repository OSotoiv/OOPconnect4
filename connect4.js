/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(width = 7, height = 6) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.board = [];
    this.p1 = undefined;
    this.p2 = undefined;
    this.currPlayer = undefined; // active player: 1 or 2
  }
  displayPlayer(player) {
    const h2 = document.getElementById('currentPlayer');
    h2.innerText = `${player}'s Turn`
  }
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const HTMLboard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('data-clickable', 'true');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    HTMLboard.append(top);

    // make main part of HTMLboard
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      HTMLboard.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.setAttribute("data-color", `${this.currPlayer.color}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);//WHAT IS STYLE.TOP????????????????????

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    // const tableTop = document.getElementById('column-top');
    // tableTop.removeEventListener('click', this.handleClick);
    const tds = document.querySelectorAll('#column-top td');
    for (let td of tds) { td.setAttribute('data-clickable', 'false') }
    setTimeout(() => alert(msg), 100);
  }
  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    if (evt.target.dataset.clickable === 'false') { return };
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.color;
    this.placeInTable(y, x);
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
    this.displayPlayer(this.currPlayer.name);
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      const winner = cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.color
      );
      if (winner) {
        highlight(cells)
      };
      return winner;
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  play(p1Name, p1Color, p2Name, p2Color) {
    this.p1 = new Player(p1Name, p1Color);
    this.p2 = new Player(p2Name, p2Color);
    this.currPlayer = this.p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.displayPlayer(this.currPlayer.name)
  }
}

class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color
  }
}