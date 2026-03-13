document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('room-length');
    const width = BuildCalc.getPositive('room-width');
    if (!length || !width) return;

    const wainsHeight = parseFloat(document.getElementById('wains-height').value); // inches
    const panelWidth = BuildCalc.getPositive('panel-width') || 48; // inches
    const numDoors = BuildCalc.getNum('num-doors') || 0;
    const doorWidth = BuildCalc.getNum('door-width') || 3;
    const wastePct = BuildCalc.getNum('waste-pct') || 10;

    const perimeter = 2 * (length + width);
    const doorDeduction = numDoors * doorWidth;
    const netLF = perimeter - doorDeduction;
    const wasteMult = 1 + wastePct / 100;

    // Wall area for wainscoting (sq ft)
    const wallArea = netLF * (wainsHeight / 12);

    // Panels: each panel covers panelWidth inches of linear run
    const panelCoverLF = panelWidth / 12; // convert to feet
    const panelsRaw = (netLF / panelCoverLF) * wasteMult;
    const panels = Math.ceil(panelsRaw);

    // Chair rail = same as net LF + waste
    const chairRailLF = netLF * wasteMult;

    // Baseboard = same
    const baseboardLF = netLF * wasteMult;

    // Adhesive: ~1 tube per 32 LF of panel
    const adhesiveTubes = Math.ceil(netLF / 32);

    BuildCalc.setResult('res-highlight', panels + ' panels needed');
    BuildCalc.setResult('res-perimeter', BuildCalc.fmt(perimeter) + ' ft');
    BuildCalc.setResult('res-net-lf', BuildCalc.fmt(netLF) + ' ft (after door deductions)');
    BuildCalc.setResult('res-wall-area', BuildCalc.fmt(wallArea) + ' sq ft');
    BuildCalc.setResult('res-panels', panels + ' panels (' + panelWidth + '" wide × ' + wainsHeight + '" tall)');
    BuildCalc.setResult('res-chair-rail', BuildCalc.fmt(chairRailLF) + ' linear feet');
    BuildCalc.setResult('res-baseboard', BuildCalc.fmt(baseboardLF) + ' linear feet');
    BuildCalc.setResult('res-adhesive', adhesiveTubes + ' tube(s) of construction adhesive');

    BuildCalc.showResults('results');
  });
});
