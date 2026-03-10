document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const length = BuildCalc.getPositive('length');
    const width = BuildCalc.getPositive('width');
    const waste = BuildCalc.getNum('waste');
    const rollsPerPallet = BuildCalc.getPositive('rollsPerPallet');
    if (!length || !width || waste === null || !rollsPerPallet) return;

    const rollSize = parseFloat(document.getElementById('rollSize').value);
    const pricePerRoll = parseFloat(document.getElementById('pricePerRoll').value) || 0;

    const area = length * width;
    const wastePct = waste / 100;
    const totalCoverage = area * (1 + wastePct);
    const rolls = Math.ceil(totalCoverage / rollSize);
    const pallets = Math.ceil(rolls / rollsPerPallet);
    const cost = rolls * pricePerRoll;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-waste', BuildCalc.fmt(waste) + '% (' + BuildCalc.fmt(area * wastePct) + ' sq ft)');
    BuildCalc.setResult('res-total', BuildCalc.fmt(totalCoverage) + ' sq ft');
    BuildCalc.setResult('res-rollsize', rollSize + ' sq ft per roll');
    BuildCalc.setResult('res-rolls', BuildCalc.fmt(rolls, 0) + ' rolls');
    BuildCalc.setResult('res-pallets', BuildCalc.fmt(pallets, 0) + ' pallet' + (pallets !== 1 ? 's' : ''));
    BuildCalc.setResult('res-cost', pricePerRoll > 0 ? BuildCalc.fmtCurrency(cost) : '—');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(rolls, 0) + ' rolls (' + BuildCalc.fmt(pallets, 0) + ' pallet' + (pallets !== 1 ? 's' : '') + ')');

    BuildCalc.showResults('results');
  });
});
