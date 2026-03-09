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
    TradeTools.clearErrors();
    let areaSqFt;

    if (inputMethod.value === 'dimensions') {
      const length = TradeTools.getPositive('area-length');
      const width = TradeTools.getPositive('area-width');
      if (!length || !width) return;
      areaSqFt = length * width;
    } else {
      areaSqFt = TradeTools.getPositive('total-sqft');
      if (!areaSqFt) return;
    }

    const depthInches = parseFloat(document.getElementById('mulch-depth').value);
    const costPerYard = TradeTools.getNum('cost-per-yard');

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

    TradeTools.setResult('res-highlight', TradeTools.fmt(cubicYards) + ' cubic yards');
    TradeTools.setResult('res-area', TradeTools.fmt(areaSqFt) + ' sq ft');
    TradeTools.setResult('res-depth', depthInches + ' inches');
    TradeTools.setResult('res-cuft', TradeTools.fmt(cubicFeet) + ' cubic feet');
    TradeTools.setResult('res-cuyd', TradeTools.fmt(cubicYards) + ' cubic yards');
    TradeTools.setResult('res-bags', bags + ' bags (2 cu ft each)');

    if (totalCostBulk !== null && costPerYard > 0) {
      TradeTools.setResult('res-cost-bulk', TradeTools.fmtCurrency(totalCostBulk) + ' bulk @ ' + TradeTools.fmtCurrency(costPerYard) + '/yd³');
    } else {
      TradeTools.setResult('res-cost-bulk', '—');
    }
    TradeTools.setResult('res-cost-bags', TradeTools.fmtCurrency(totalCostBags) + ' bagged @ $4.50/bag');

    TradeTools.showResults('results');
  });
});
