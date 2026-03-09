document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const wallLength = BuildCalc.getPositive('wall-length');
    const wallHeight = BuildCalc.getPositive('wall-height');
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

    BuildCalc.setResult('res-wall-length', BuildCalc.fmt(wallLength) + ' ft (' + BuildCalc.fmt(lengthInches, 0) + ' in)');
    BuildCalc.setResult('res-spacing', spacing + '" on center');
    BuildCalc.setResult('res-studs-basic', studs + ' studs');
    BuildCalc.setResult('res-corner-studs', cornerStuds + ' studs (' + corners + ' corners × 3)');
    BuildCalc.setResult('res-extras', extras + ' studs (10% waste/cripples)');
    BuildCalc.setResult('res-total-studs', totalStuds + ' studs');
    BuildCalc.setResult('res-plates', totalPlates + ' plates (' + plateBoards + ' boards × 8 ft)');
    BuildCalc.setResult('res-plate-lumber', BuildCalc.fmt(plateLumber) + ' linear ft');
    BuildCalc.setResult('res-highlight', totalStuds + ' studs + ' + plateBoards + ' plate boards');

    BuildCalc.showResults('results');
  });
});
