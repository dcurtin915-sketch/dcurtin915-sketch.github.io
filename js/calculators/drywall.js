document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const roomLength = TradeTools.getPositive('room-length');
    const roomWidth = TradeTools.getPositive('room-width');
    const roomHeight = TradeTools.getPositive('room-height');
    const doors = TradeTools.getInt('doors');
    const windows = TradeTools.getInt('windows');
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

    TradeTools.setResult('res-wall-area', TradeTools.fmt(netWallArea, 0) + ' sq ft');
    TradeTools.setResult('res-ceiling-area', TradeTools.fmt(ceilingArea, 0) + ' sq ft');
    TradeTools.setResult('res-total-area', TradeTools.fmt(totalArea, 0) + ' sq ft');
    TradeTools.setResult('res-sheets', sheets + ' sheets (4×8)');
    TradeTools.setResult('res-tape', tapeFt + ' linear ft');
    TradeTools.setResult('res-compound', compound + ' boxes');
    TradeTools.setResult('res-screws', screws + ' lbs');
    TradeTools.setResult('res-highlight', sheets + ' drywall sheets');

    TradeTools.showResults('results');
  });
});
