const refreshOutput = function(bitboardId) {
  let paddedBinaryString = getBitboardPaddedBinary(bitboardId);

  updateBinaryElement(bitboardId, paddedBinaryString);

  let decimalOutput = BigInt(`0b${paddedBinaryString}`);
  let decimalValueElement = document.querySelector(`#${bitboardId} .decimal_value`);
  decimalValueElement.value = decimalOutput;
};

const updateBinaryElement = function(bitboardId, paddedBinaryString ) {
  let splitString = paddedBinaryString.match(/.{1,8}/g);
  let outputBinaryElement = document.querySelector(`#${bitboardId} .output_binary`);
  outputBinaryElement.innerHTML = splitString.map(function(e) { return `<li>${e}</li>`; }).join('');
};

const updateBoardDimensions = function(bitboardId, boardDimensions) {
  let board = document.querySelector(`#${bitboardId} .board`);
  board.replaceChildren();

  let rowTemplate = document.querySelector('#row');
  for (let y = 0; y < boardDimensions.board_height; y++) {
    let cloneRow = document.importNode(rowTemplate.content, true);
    let row = cloneRow.querySelector('.row');

    let cellTemplate = document.querySelector('#cell');
    for (let x = 0; x < boardDimensions.board_width; x++) {
      let cloneCell = document.importNode(cellTemplate.content, true);
      row.appendChild(cloneCell);
    }

    board.appendChild(cloneRow);
  }
};

const updateCells = function(bitboardId, paddedBinaryString) {
  let cells = document.querySelectorAll(`#${bitboardId} .cell`);
  cells.forEach(function(cell, index) {
    let c = paddedBinaryString.charAt(index);
    cell.dataset.value = c;
  });
};

const getBoardDimensions = function(form) {
  return Object.fromEntries(new FormData(form));
};

const numberToPaddedBinary = function(bitboardId, number) {
  let cells = document.querySelectorAll(`#${bitboardId} .cell`);
  let numberOfCells = cells.length;
  let binaryString = number.toString(2);
  return binaryString.padStart(numberOfCells,'0');
}

const getBitboardPaddedBinary = function(bitboardId) {
  const cells = document.querySelectorAll(`#${bitboardId} .cell`);
  let values = Array.from(cells).map(function(cell) {
    return cell.dataset.value;
  });

  let numberOfCells = cells.length;
  let binaryString = values.join('');
  return binaryString.padStart(numberOfCells,'0');
}

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
      let paddedBinaryString = numberToPaddedBinary(bitboardId, value);

      updateCells(bitboardId, paddedBinaryString);
      updateBinaryElement(bitboardId, paddedBinaryString);
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
    setupCellListeners('bitboard_a');
    refreshOutput('bitboard_a');

    updateBoardDimensions('bitboard_b', boardDimensions);
    setupCellListeners('bitboard_b');
    refreshOutput('bitboard_b');

    updateBoardDimensions('bitboard_c', boardDimensions);
    refreshOutput('bitboard_c');
  });

  let boardWidthInput = document.getElementById('board_width');
  boardWidthInput.addEventListener('change', function(event) {
    let boardWidth = parseInt(event.target.value);
    if (!Number.isNaN(boardWidth) && boardWidth > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      // update bitboards a, b, c
      updateBoardDimensions('bitboard_a', boardDimensions);
      setupCellListeners('bitboard_a');
      refreshOutput('bitboard_a');

      updateBoardDimensions('bitboard_b', boardDimensions);
      setupCellListeners('bitboard_b');
      refreshOutput('bitboard_b');

      updateBoardDimensions('bitboard_c', boardDimensions);
      refreshOutput('bitboard_c');
    }
  });

  let boardHeightInput = document.getElementById('board_height');
  boardHeightInput.addEventListener('change', function(event) {
    let boardHeight = parseInt(event.target.value);
    if (!Number.isNaN(boardHeight) && boardHeight > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      // update bitboards a, b, c
      updateBoardDimensions('bitboard_a', boardDimensions);
      setupCellListeners('bitboard_a');
      refreshOutput('bitboard_a');

      updateBoardDimensions('bitboard_b', boardDimensions);
      setupCellListeners('bitboard_b');
      refreshOutput('bitboard_b');

      updateBoardDimensions('bitboard_c', boardDimensions);
      refreshOutput('bitboard_c');
    }
  });

  let calculatorForm = document.getElementById('calculator');
  calculatorForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const valueA = document.querySelector('#bitboard_a .decimal_value').value;
    const valueB = document.querySelector('#bitboard_b .decimal_value').value;
    const operator = document.querySelector('#calculator .operator').value;

    let result = undefined;
    switch (operator) {
      case 'and':
        result = BigInt(valueA) & BigInt(valueB);
        break;
      case 'or':
        result = BigInt(valueA) | BigInt(valueB);
        break;
      case 'xor':
        result = BigInt(valueA) ^ BigInt(valueB);
        break;
      default:
        break;
    }
    let paddedBinaryString = numberToPaddedBinary('bitboard_c', result);

    // update cells
    updateCells('bitboard_c', paddedBinaryString);

    // update binary element
    updateBinaryElement('bitboard_c', paddedBinaryString);

    // update decimal
    let resultDecimal = document.querySelector('#bitboard_c .decimal_value');
    resultDecimal.value = result;
  });

  // Decimal Form
  setupDecimalFormListener('bitboard_a');
  setupDecimalFormListener('bitboard_b');
  // Cell Listeners
  setupCellListeners('bitboard_a');
  setupCellListeners('bitboard_b');
});
