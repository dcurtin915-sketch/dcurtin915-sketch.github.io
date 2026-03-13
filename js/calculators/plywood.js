document.addEventListener('DOMContentLoaded', () => {
  const inputMethod = document.getElementById('input-method');
  const dimFields = document.getElementById('dim-fields');
  const sqftField = document.getElementById('sqft-field');

  inputMethod.addEventListener('change', () => {
    if (inputMethod.value === 'dimensions') {
      dimFields.style.display = 'block';
      sqftField.style.display = 'none';
    } else {
      dimFields.style.display = 'none';
      sqftField.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    let areaSqFt;

    if (inputMethod.value === 'dimensions') {
      const length = BuildCalc.getPositive('area-length');
      const height = BuildCalc.getPositive('area-height');
      if (!length || !height) return;
      areaSqFt = length * height;
    } else {
      areaSqFt = BuildCalc.getPositive('total-sqft');
      if (!areaSqFt) return;
    }

    const sheetSize = parseFloat(document.getElementById('sheet-size').value);
    const wastePct = BuildCalc.getNum('waste-pct') || 10;
    const costPerSheet = BuildCalc.getNum('cost-per-sheet');

    const areaWithWaste = areaSqFt * (1 + wastePct / 100);
    const sheets = Math.ceil(areaWithWaste / sheetSize);

    const totalCost = costPerSheet !== null && costPerSheet > 0
      ? sheets * costPerSheet
      : null;

    BuildCalc.setResult('res-highlight', sheets + ' sheets');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-area-waste', BuildCalc.fmt(areaWithWaste) + ' sq ft (+' + wastePct + '% waste)');
    BuildCalc.setResult('res-sheet-cov', sheetSize + ' sq ft per sheet');
    BuildCalc.setResult('res-sheets', sheets + ' sheets');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerSheet) + '/sheet');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
