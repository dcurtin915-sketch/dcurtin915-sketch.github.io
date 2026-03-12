document.addEventListener('DOMContentLoaded', () => {
  const inputMethod = document.getElementById('input-method');
  const dimFields = document.getElementById('dim-fields');
  const perimField = document.getElementById('perim-field');

  inputMethod.addEventListener('change', () => {
    if (inputMethod.value === 'dimensions') {
      dimFields.style.display = 'block';
      perimField.style.display = 'none';
    } else {
      dimFields.style.display = 'none';
      perimField.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    let perimeter;

    if (inputMethod.value === 'dimensions') {
      const length = BuildCalc.getPositive('room-length');
      const width = BuildCalc.getPositive('room-width');
      if (!length || !width) return;
      perimeter = 2 * (length + width);
    } else {
      perimeter = BuildCalc.getPositive('total-perimeter');
      if (!perimeter) return;
    }

    const pieceLen = parseFloat(document.getElementById('piece-length').value);
    const wastePct = parseFloat(document.getElementById('waste-pct').value) || 0;
    const insideCorners = parseInt(document.getElementById('inside-corners').value) || 0;
    const outsideCorners = parseInt(document.getElementById('outside-corners').value) || 0;
    const costPerFoot = BuildCalc.getNum('cost-per-foot');

    const linearFeetWithWaste = perimeter * (1 + wastePct / 100);
    const pieces = Math.ceil(linearFeetWithWaste / pieceLen);
    const totalCost = costPerFoot !== null && costPerFoot > 0 ? linearFeetWithWaste * costPerFoot : null;

    BuildCalc.setResult('res-highlight', pieces + ' pieces (' + pieceLen + '\' each)');
    BuildCalc.setResult('res-perimeter', BuildCalc.fmt(perimeter) + ' linear feet');
    BuildCalc.setResult('res-lf', BuildCalc.fmt(linearFeetWithWaste) + ' ft (includes ' + wastePct + '% waste)');
    BuildCalc.setResult('res-pieces', pieces + ' pieces × ' + pieceLen + '\' = ' + BuildCalc.fmt(pieces * pieceLen) + ' ft purchased');
    BuildCalc.setResult('res-inside', insideCorners + ' inside corners');
    BuildCalc.setResult('res-outside', outsideCorners + ' outside corners');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerFoot) + '/ft');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
