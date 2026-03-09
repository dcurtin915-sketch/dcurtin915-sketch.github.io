document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const deckLength = BuildCalc.getPositive('deck-length');
    const deckWidth = BuildCalc.getPositive('deck-width');
    if (!deckLength || !deckWidth) return;

    const boardWidth = parseFloat(document.getElementById('board-width').value);
    const gapSpacing = parseFloat(document.getElementById('gap-spacing').value);
    const boardLength = parseFloat(document.getElementById('board-length').value);
    const wasteFactor = parseFloat(document.getElementById('waste-factor').value) / 100;

    // Total deck area
    const totalSqFt = deckLength * deckWidth;

    // Board coverage width (board width + gap) in inches
    const boardCoverageIn = boardWidth + gapSpacing;

    // Number of boards across the width
    // Boards run along the length, so we span the width
    const widthInches = deckWidth * 12;
    const boardsAcross = Math.ceil(widthInches / boardCoverageIn);

    // How many board lengths needed along the deck length
    const boardsAlongLength = Math.ceil(deckLength / boardLength);

    // Total boards
    const totalBoardsExact = boardsAcross * boardsAlongLength;
    const totalBoardsWithWaste = Math.ceil(totalBoardsExact * (1 + wasteFactor));

    // Joists: perpendicular to deck boards, 16" on center
    const joistSpacing = 16; // inches
    const joistCount = Math.ceil((deckLength * 12) / joistSpacing) + 1;

    // Deck screws: approximately 350 screws per 100 sq ft (2 screws per joist per board)
    const screwCount = Math.ceil(totalSqFt * 3.5);
    // Screws per pound: ~90 for #8 2.5" deck screws
    const screwLbs = Math.ceil(screwCount / 90);

    // Linear feet of decking
    const linearFt = totalBoardsWithWaste * boardLength;

    BuildCalc.setResult('res-highlight', totalBoardsWithWaste + ' deck boards');
    BuildCalc.setResult('res-area', BuildCalc.fmt(totalSqFt) + ' sq ft');
    BuildCalc.setResult('res-boards-exact', totalBoardsExact + ' boards (exact)');
    BuildCalc.setResult('res-boards-waste', totalBoardsWithWaste + ' boards (with ' + (wasteFactor * 100) + '% waste)');
    BuildCalc.setResult('res-board-size', boardWidth + '″ wide × ' + boardLength + ' ft long');
    BuildCalc.setResult('res-linear-ft', BuildCalc.fmt(linearFt) + ' linear ft of decking');
    BuildCalc.setResult('res-joists', joistCount + ' joists (16″ OC, ' + BuildCalc.fmt(deckWidth) + ' ft long)');
    BuildCalc.setResult('res-screws', screwCount + ' screws (~' + screwLbs + ' lbs)');

    BuildCalc.showResults('results');
  });
});
