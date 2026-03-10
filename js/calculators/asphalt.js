document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const length = BuildCalc.getPositive('length');
    const width = BuildCalc.getPositive('width');
    const waste = BuildCalc.getNum('waste');
    if (!length || !width || waste === null) return;

    const thickness = parseFloat(document.getElementById('thickness').value);
    const density = parseFloat(document.getElementById('density').value);
    const pricePerTon = parseFloat(document.getElementById('pricePerTon').value) || 0;
    const wastePct = waste / 100;

    const area = length * width;
    const thicknessFt = thickness / 12;
    const volumeCuFt = area * thicknessFt;
    const volumeCuYd = volumeCuFt / 27;

    const weightLbs = volumeCuFt * density;
    const netTons = weightLbs / 2000;
    const totalTons = netTons * (1 + wastePct);
    const cost = totalTons * pricePerTon;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-thickness', thickness + ' inches');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(volumeCuFt) + ' cubic feet');
    BuildCalc.setResult('res-cuyd', BuildCalc.fmt(volumeCuYd) + ' cubic yards');
    BuildCalc.setResult('res-density', density + ' lbs/cu ft');
    BuildCalc.setResult('res-nettons', BuildCalc.fmt(netTons) + ' tons');
    BuildCalc.setResult('res-tons', BuildCalc.fmt(totalTons) + ' tons (incl. ' + waste + '% waste)');
    BuildCalc.setResult('res-cost', pricePerTon > 0 ? BuildCalc.fmtCurrency(cost) : '—');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalTons) + ' tons of asphalt');

    BuildCalc.showResults('results');
  });
});
