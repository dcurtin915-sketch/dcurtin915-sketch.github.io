document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('room-length');
    const width = BuildCalc.getPositive('room-width');
    if (!length || !width) return;

    const numDoors = BuildCalc.getNum('num-doors') || 0;
    const doorWidth = BuildCalc.getNum('door-width') || 3;
    const trimLength = parseFloat(document.getElementById('trim-length').value);
    const wastePct = BuildCalc.getNum('waste-pct') || 10;
    const insideCorners = BuildCalc.getNum('inside-corners') || 0;
    const outsideCorners = BuildCalc.getNum('outside-corners') || 0;
    const costPerFoot = BuildCalc.getNum('cost-per-foot');

    const perimeter = 2 * (length + width);
    const doorDeduction = numDoors * doorWidth;
    const netLF = perimeter - doorDeduction;
    const withWaste = netLF * (1 + wastePct / 100);
    const pieces = Math.ceil(withWaste / trimLength);

    const totalCost = costPerFoot !== null && costPerFoot > 0
      ? withWaste * costPerFoot
      : null;

    BuildCalc.setResult('res-highlight', pieces + ' pieces (' + BuildCalc.fmt(withWaste) + ' linear feet)');
    BuildCalc.setResult('res-perimeter', BuildCalc.fmt(perimeter) + ' ft');
    BuildCalc.setResult('res-doors', '−' + BuildCalc.fmt(doorDeduction) + ' ft (' + numDoors + ' door' + (numDoors !== 1 ? 's' : '') + ')');
    BuildCalc.setResult('res-net', BuildCalc.fmt(netLF) + ' ft');
    BuildCalc.setResult('res-with-waste', BuildCalc.fmt(withWaste) + ' ft (+' + wastePct + '% waste)');
    BuildCalc.setResult('res-pieces', pieces + ' pieces @ ' + trimLength + ' ft each');
    BuildCalc.setResult('res-inside', insideCorners + ' inside corner(s)');
    BuildCalc.setResult('res-outside', outsideCorners + ' outside corner(s)');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerFoot) + '/lf');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
