const refreshOutput = function() {
  const cells = document.querySelectorAll('.cell');
  let values = Array.from(cells).map(function(cell) {
    return cell.dataset.value;
  });

  let numberOfCells = cells.length;

  let outputBinaryElement = document.getElementById('output_binary');
  let binaryString = values.join('');
  let paddedBinaryString = binaryString.padStart(numberOfCells,'0');
  outputBinaryElement.innerHTML = paddedBinaryString;

  let decimalOutput = BigInt(`0b${binaryString}`);
  let decimalValueElement = document.getElementById('decimal_value');
  decimalValueElement.value = decimalOutput;
};

const setupCellListeners = function() {
  let cells = document.querySelectorAll('.cell');
  cells.forEach(function(cell) {
    cell.addEventListener('click', function(event) {
      let value = cell.dataset.value;
      if (value === '0') {
        cell.dataset.value = '1';
      } else {
        cell.dataset.value = '0';
      }
      refreshOutput();
    });
  });
};

const setupActionListeners = function() {
  let removeRowButtons = document.querySelectorAll('.remove_row');
  removeRowButtons.forEach(function(removeRowButton) {
    removeRowButton.addEventListener('click', function(event) {
      let form = document.getElementById('board_dimensions');
      let boardDimensions = getBoardDimensions(form);
      let newBoardDimensions = {
        board_width: boardDimensions.board_width,
        board_height: boardDimensions.board_height - 1
      };
      updateBoardDimensions(newBoardDimensions);
      updateBoardDimensionsForm(newBoardDimensions);
      refreshOutput();
    });
  });

  let removeColumnButtons = document.querySelectorAll('.remove_column');
  removeColumnButtons.forEach(function(removeColumnButton) {
    removeColumnButton.addEventListener('click', function(event) {
      let form = document.getElementById('board_dimensions');
      let boardDimensions = getBoardDimensions(form);
      let newBoardDimensions = {
        board_width: boardDimensions.board_width - 1,
        board_height: boardDimensions.board_height
      };
      updateBoardDimensions(newBoardDimensions);
      updateBoardDimensionsForm(newBoardDimensions);
      refreshOutput();
    });
  });
};

const updateBoardDimensionsForm = function(boardDimensions) {
  let boardWidthInput = document.getElementById('board_width');
  boardWidthInput.value = boardDimensions.board_width;
  let boardHeightInput = document.getElementById('board_height');
  boardHeightInput.value = boardDimensions.board_height;
};

const updateBoardDimensions = function(boardDimensions) {
  let board = document.getElementById('board');
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

    let rowActionTemplate = document.querySelector('#row_action');
    let cloneRowAction = document.importNode(rowActionTemplate.content, true);
    let rowAction = cloneRowAction.querySelector('.row_action');
    rowAction.id = `row_action_${y}`;
    let removeRow = rowAction.querySelector('.remove_row');
    removeRow.id = `remove_row_${y}`;
    removeRow.dataset.value = y;

    row.appendChild(cloneRowAction);

    board.appendChild(cloneRow);
  }

  let actionRowTemplate = document.querySelector('#row');
  let cloneActionRow = document.importNode(actionRowTemplate.content, true);
  let actionRow = cloneActionRow.querySelector('.row');
  actionRow.id = `action_row`;

  let columnActionTemplate = document.querySelector('#column_action');
  for (let x = 0; x < boardDimensions.board_width; x++) {
    let cloneColumnAction = document.importNode(columnActionTemplate.content, true);
    let columnAction = cloneColumnAction.querySelector('.column_action');
    columnAction.id = `column_action_${x}`;
    let removeColumn = columnAction.querySelector('.remove_column');
    removeColumn.id = `remove_column_${x}`;
    removeColumn.dataset.value = x;
    actionRow.appendChild(cloneColumnAction);
  }

  board.appendChild(cloneActionRow);

  setupCellListeners();
  setupActionListeners();
};

const getBoardDimensions = function(form) {
  return Object.fromEntries(new FormData(form));
};

document.addEventListener('DOMContentLoaded', function(event) {
  // Dimensions Form
  let dimensionsForm = document.getElementById('board_dimensions');

  dimensionsForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let boardDimensions = getBoardDimensions(dimensionsForm);
    updateBoardDimensions(boardDimensions);
    refreshOutput();
  });

  let boardWidthInput = document.getElementById('board_width');
  boardWidthInput.addEventListener('change', function(event) {
    let boardWidth = parseInt(event.target.value);
    if (!Number.isNaN(boardWidth) && boardWidth > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      updateBoardDimensions(boardDimensions);
      refreshOutput();
    }
  });

  let boardHeightInput = document.getElementById('board_height');
  boardHeightInput.addEventListener('change', function(event) {
    let boardHeight = parseInt(event.target.value);
    if (!Number.isNaN(boardHeight) && boardHeight > 0) {
      let boardDimensions = getBoardDimensions(dimensionsForm);
      updateBoardDimensions(boardDimensions);
      refreshOutput();
    }
  });

  // Decimal Form
  let decimalForm = document.getElementById('decimal');

  decimalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = Object.fromEntries(new FormData(decimalForm));
    let value = parseInt(formData.decimal_value);
    if (!Number.isNaN(value)) {
      let cells = document.querySelectorAll('.cell');
      let numberOfCells = cells.length;
      let binaryString = value.toString(2);
      let paddedBinaryString = binaryString.padStart(numberOfCells,'0');
      cells.forEach(function(cell, index) {
        let c = paddedBinaryString.charAt(index);
        cell.dataset.value = c;
      });

      let outputBinaryElement = document.getElementById('output_binary');
      outputBinaryElement.innerHTML = paddedBinaryString;
    }
  });

  // Cell Listeners
  setupCellListeners();
  // Action Button Listeners
  setupActionListeners();
});
