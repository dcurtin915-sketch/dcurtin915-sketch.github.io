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
      const width = BuildCalc.getPositive('area-width');
      if (!length || !width) return;
      areaSqFt = length * width;
    } else {
      areaSqFt = BuildCalc.getPositive('total-sqft');
      if (!areaSqFt) return;
    }

    const depthInches = parseFloat(document.getElementById('mulch-depth').value);
    const costPerYard = BuildCalc.getNum('cost-per-yard');

    // Convert depth to feet
    const depthFt = depthInches / 12;

    // Volume in cubic feet
    const cubicFeet = areaSqFt * depthFt;

    // Convert to cubic yards
    const cubicYards = cubicFeet / 27;

    // Bags: standard bag is 2 cu ft
    const bags = Math.ceil(cubicFeet / 2);

    // Cost estimate
    const totalCostBulk = costPerYard !== null ? cubicYards * costPerYard : null;
    const costPerBag = 4.50; // average bag price
    const totalCostBags = bags * costPerBag;

    BuildCalc.setResult('res-highlight', BuildCalc.fmt(cubicYards) + ' cubic yards');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-depth', depthInches + ' inches');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(cubicFeet) + ' cubic feet');
    BuildCalc.setResult('res-cuyd', BuildCalc.fmt(cubicYards) + ' cubic yards');
    BuildCalc.setResult('res-bags', bags + ' bags (2 cu ft each)');

    if (totalCostBulk !== null && costPerYard > 0) {
      BuildCalc.setResult('res-cost-bulk', BuildCalc.fmtCurrency(totalCostBulk) + ' bulk @ ' + BuildCalc.fmtCurrency(costPerYard) + '/yd³');
    } else {
      BuildCalc.setResult('res-cost-bulk', '—');
    }
    BuildCalc.setResult('res-cost-bags', BuildCalc.fmtCurrency(totalCostBags) + ' bagged @ $4.50/bag');

    BuildCalc.showResults('results');
  });
});
