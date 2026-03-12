document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const roomLength = BuildCalc.getPositive('roomLength');
    const roomWidth = BuildCalc.getPositive('roomWidth');
    if (!roomLength || !roomWidth) return;

    const rollWidth = parseFloat(document.getElementById('rollWidth').value);
    const wastePct = parseFloat(document.getElementById('waste').value) || 10;
    const carpetCost = parseFloat(document.getElementById('carpetCost').value) || 0;
    const paddingCost = parseFloat(document.getElementById('paddingCost').value) || 0;

    const area = roomLength * roomWidth;
    const wasteArea = area * (wastePct / 100);
    const totalSqFt = area + wasteArea;
    const linearFt = Math.ceil(totalSqFt / rollWidth);
    const sqYards = totalSqFt / 9;
    const paddingSqFt = totalSqFt;

    const carpetTotal = totalSqFt * carpetCost;
    const paddingTotal = paddingSqFt * paddingCost;
    const totalCost = carpetTotal + paddingTotal;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-waste', BuildCalc.fmt(wasteArea, 1) + ' sq ft (' + wastePct + '%)');
    BuildCalc.setResult('res-total', BuildCalc.fmt(totalSqFt, 1) + ' sq ft');
    BuildCalc.setResult('res-linear', BuildCalc.fmt(linearFt, 0) + ' linear ft (from ' + rollWidth + ' ft roll)');
    BuildCalc.setResult('res-sqyd', BuildCalc.fmt(sqYards) + ' sq yd');
    BuildCalc.setResult('res-padding', BuildCalc.fmt(paddingSqFt, 1) + ' sq ft');
    BuildCalc.setResult('res-carpet-cost', carpetCost > 0 ? '$' + BuildCalc.fmt(carpetTotal) : 'Enter price above');
    BuildCalc.setResult('res-padding-cost', paddingCost > 0 ? '$' + BuildCalc.fmt(paddingTotal) : 'Enter price above');
    BuildCalc.setResult('res-total-cost', (carpetCost > 0 || paddingCost > 0) ? '$' + BuildCalc.fmt(totalCost) : 'Enter prices above');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalSqFt, 0) + ' sq ft of carpet (' + BuildCalc.fmt(sqYards, 1) + ' sq yd)');

    BuildCalc.showResults('results');
  });
});
