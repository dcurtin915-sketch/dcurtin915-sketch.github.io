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

    const depthInches = parseFloat(document.getElementById('soil-depth').value);
    const costPerYard = BuildCalc.getNum('cost-per-yard');

    const depthFt = depthInches / 12;
    const cubicFeet = areaSqFt * depthFt;
    const cubicYards = cubicFeet / 27;

    // Topsoil weighs ~2,200 lbs per cubic yard (1.1 tons)
    const tons = cubicYards * 1.1;

    // 40-lb bags: 1 cubic yard ≈ 2,200 lbs → ~55 bags of 40 lbs
    // 40 lb bag ≈ 0.75 cu ft
    const bags = Math.ceil(cubicFeet / 0.75);

    const totalCost = costPerYard !== null && costPerYard > 0 ? cubicYards * costPerYard : null;

    BuildCalc.setResult('res-highlight', BuildCalc.fmt(cubicYards) + ' cubic yards');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-depth', depthInches + ' inches');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(cubicFeet) + ' cubic feet');
    BuildCalc.setResult('res-cuyd', BuildCalc.fmt(cubicYards) + ' cubic yards');
    BuildCalc.setResult('res-tons', BuildCalc.fmt(tons) + ' tons (~' + BuildCalc.fmt(tons * 2000) + ' lbs)');
    BuildCalc.setResult('res-bags', bags + ' bags (40 lb each)');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerYard) + '/yd³');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
