const refreshOutput = function(bitboardId) {
  const cells = document.querySelectorAll(`#${bitboardId} .cell`);
  let values = Array.from(cells).map(function(cell) {
    return cell.dataset.value;
  });

  let numberOfCells = cells.length;

  let outputBinaryElement = document.querySelector(`#${bitboardId} .output_binary`);
  let binaryString = values.join('');
  let paddedBinaryString = binaryString.padStart(numberOfCells,'0');
  outputBinaryElement.innerHTML = paddedBinaryString;

  let decimalOutput = BigInt(`0b${binaryString}`);
  let decimalValueElement = document.querySelector(`#${bitboardId} .decimal_value`);
  decimalValueElement.value = decimalOutput;
};

const updateBoardDimensions = function(bitboardId, boardDimensions) {
  let board = document.querySelector(`#${bitboardId} .board`);
  board.replaceChildren();

  let rowTemplate = document.querySelector('#row');
  for (let y = 0; y < boardDimensions.board_height; y++) {
    let cloneRow = document.importNode(rowTemplate.content, true);
    let row = cloneRow.querySelector('.row');
    row.id = `row_${y}`;

    let cellTemplate = document.querySelector('#cell');
    for (let x = 0; x < boardDimensions.board_width; x++) {
      let cloneCell = document.importNode(cellTemplate.content, true);
      let cell = cloneCell.querySelector('.cell');
      cell.id = `cell_${y}_${x}`;
      row.appendChild(cloneCell);
    }

    board.appendChild(cloneRow);
  }
  setupCellListeners(bitboardId);
};

const getBoardDimensions = function(form) {
  return Object.fromEntries(new FormData(form));
};

const setupCellListeners = function(bitboardId) {
  let cells = document.querySelectorAll(`#${bitboardId} .cell`);
  cells.forEach(function(cell) {
    cell.addEventListener('click', function(_event) {
      let value = cell.dataset.value;
      if (value === '0') {
        cell.dataset.value = '1';
      } else {
        cell.dataset.value = '0';
      }
      refreshOutput(bitboardId);
    });
  });
};

const setupDecimalFormListener = function(bitboardId) {
  let decimalForm = document.querySelector(`#${bitboardId} .decimal`);

  decimalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = Object.fromEntries(new FormData(decimalForm));
    let value = parseInt(formData.decimal_value);
    if (!Number.isNaN(value)) {
      let cells = document.querySelectorAll(`#${bitboardId} .cell`);
      let numberOfCells = cells.length;
      let binaryString = value.toString(2);
      let paddedBinaryString = binaryString.padStart(numberOfCells,'0');
      cells.forEach(function(cell, index) {
        let c = paddedBinaryString.charAt(index);
        cell.dataset.value = c;
      });

      let outputBinaryElement = document.querySelector(`#${bitboardId} .output_binary`);
      outputBinaryElement.innerHTML = paddedBinaryString;
    }
  });
};

document.addEventListener('DOMContentLoaded', function(_event) {
  // Dimensions Form
  let dimensionsForm = document.getElementById('board_dimensions');

  dimensionsForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let boardDimensions = getBoardDimensions(dimensionsForm);
    // update bitboards a, b, c
    updateBoardDimensions('bitboard_a', boardDimensions);
    refreshOutput('bitboard_a');
  });

  let boardWidthInput = document.getElementById('board_width');
  boardWidthInput.addEventListener('change', function(event) {
    let boardWidth = parseInt(event.target.value);
    if (!Number.isNaN(boardWidth) && boardWidth > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      // update bitboards a, b, c
      updateBoardDimensions('bitboard_a', boardDimensions);
      refreshOutput('bitboard_a');
    }
  });

  let boardHeightInput = document.getElementById('board_height');
  boardHeightInput.addEventListener('change', function(event) {
    let boardHeight = parseInt(event.target.value);
    if (!Number.isNaN(boardHeight) && boardHeight > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      // update bitboards a, b, c
      updateBoardDimensions('bitboard_a', boardDimensions);
      refreshOutput('bitboard_a');
    }
  });

  // Decimal Form
  setupDecimalFormListener('bitboard_a');
  // Cell Listeners
  setupCellListeners('bitboard_a');
});
