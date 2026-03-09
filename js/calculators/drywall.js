document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const roomLength = BuildCalc.getPositive('room-length');
    const roomWidth = BuildCalc.getPositive('room-width');
    const roomHeight = BuildCalc.getPositive('room-height');
    const doors = BuildCalc.getInt('doors');
    const windows = BuildCalc.getInt('windows');
    if (!roomLength || !roomWidth || !roomHeight || doors === null || windows === null) return;

    const perimeter = 2 * (roomLength + roomWidth);
    const wallArea = perimeter * roomHeight;
    const ceilingArea = roomLength * roomWidth;
    const doorDeduct = doors * 21; // ~3x7 ft = 21 sq ft
    const windowDeduct = windows * 15; // ~3x5 ft = 15 sq ft
    const netWallArea = Math.max(0, wallArea - doorDeduct - windowDeduct);
    const totalArea = netWallArea + ceilingArea;

    const sheetArea = 4 * 8; // 32 sq ft
    const sheets = Math.ceil(totalArea / sheetArea);

    // Tape: roughly perimeter of each sheet (linear ft of joints)
    // Approximate: total area / 4 ft wide = number of joints × 8 ft tall
    const tapeFt = Math.ceil((totalArea / 4) * 1.1);
    // Joint compound: ~1 box per 100 sq ft
    const compound = Math.ceil(totalArea / 100);
    // Screws: ~1 lb per 100 sq ft (about 60 screws per sheet)
    const screws = Math.ceil(totalArea / 100);

    BuildCalc.setResult('res-wall-area', BuildCalc.fmt(netWallArea, 0) + ' sq ft');
    BuildCalc.setResult('res-ceiling-area', BuildCalc.fmt(ceilingArea, 0) + ' sq ft');
    BuildCalc.setResult('res-total-area', BuildCalc.fmt(totalArea, 0) + ' sq ft');
    BuildCalc.setResult('res-sheets', sheets + ' sheets (4×8)');
    BuildCalc.setResult('res-tape', tapeFt + ' linear ft');
    BuildCalc.setResult('res-compound', compound + ' boxes');
    BuildCalc.setResult('res-screws', screws + ' lbs');
    BuildCalc.setResult('res-highlight', sheets + ' drywall sheets');

    BuildCalc.showResults('results');
  });
});
