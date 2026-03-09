document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const wallLength = TradeTools.getPositive('wall-length');
    const wallHeight = TradeTools.getPositive('wall-height');
    if (!wallLength || !wallHeight) return;

    const spacing = parseInt(document.getElementById('spacing').value);
    const corners = parseInt(document.getElementById('corners').value);

    const lengthInches = wallLength * 12;
    const studs = Math.ceil(lengthInches / spacing) + 1;

    // Top and bottom plates: 2 plates × wall length (top plate doubled for engineering)
    const plateLengthFt = wallLength;
    const topPlates = 2; // double top plate
    const bottomPlates = 1;
    const totalPlates = topPlates + bottomPlates;
    const plateLumber = totalPlates * plateLengthFt;

    // Corner studs: 3 studs per corner for a proper corner assembly
    const cornerStuds = corners * 3;

    // Extra: add 10% for waste/cripples/headers
    const subtotal = studs + cornerStuds;
    const extras = Math.ceil(subtotal * 0.10);
    const totalStuds = subtotal + extras;

    // Plates as 8ft or matching wall height studs
    const plateBoards = Math.ceil(plateLumber / 8); // assuming 8ft lumber

    TradeTools.setResult('res-wall-length', TradeTools.fmt(wallLength) + ' ft (' + TradeTools.fmt(lengthInches, 0) + ' in)');
    TradeTools.setResult('res-spacing', spacing + '" on center');
    TradeTools.setResult('res-studs-basic', studs + ' studs');
    TradeTools.setResult('res-corner-studs', cornerStuds + ' studs (' + corners + ' corners × 3)');
    TradeTools.setResult('res-extras', extras + ' studs (10% waste/cripples)');
    TradeTools.setResult('res-total-studs', totalStuds + ' studs');
    TradeTools.setResult('res-plates', totalPlates + ' plates (' + plateBoards + ' boards × 8 ft)');
    TradeTools.setResult('res-plate-lumber', TradeTools.fmt(plateLumber) + ' linear ft');
    TradeTools.setResult('res-highlight', totalStuds + ' studs + ' + plateBoards + ' plate boards');

    TradeTools.showResults('results');
  });
});
