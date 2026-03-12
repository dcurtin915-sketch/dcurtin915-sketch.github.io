document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const roomLength = BuildCalc.getPositive('roomLength');
    const roomWidth = BuildCalc.getPositive('roomWidth');
    const plankLength = BuildCalc.getPositive('plankLength');
    const plankWidth = BuildCalc.getPositive('plankWidth');
    const boxCoverage = BuildCalc.getPositive('boxCoverage');
    if (!roomLength || !roomWidth || !plankLength || !plankWidth || !boxCoverage) return;

    const wastePct = parseFloat(document.getElementById('waste').value) || 10;
    const costPerBox = parseFloat(document.getElementById('costPerBox').value) || 0;

    const area = roomLength * roomWidth;
    const wasteArea = area * (wastePct / 100);
    const totalSqFt = area + wasteArea;
    const plankSqFt = (plankLength * plankWidth) / 144;
    const totalPlanks = Math.ceil(totalSqFt / plankSqFt);
    const boxes = Math.ceil(totalSqFt / boxCoverage);
    const totalCost = boxes * costPerBox;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-waste', BuildCalc.fmt(wasteArea, 1) + ' sq ft (' + wastePct + '%)');
    BuildCalc.setResult('res-total-sqft', BuildCalc.fmt(totalSqFt, 1) + ' sq ft');
    BuildCalc.setResult('res-plank', plankLength + '″ × ' + plankWidth + '″');
    BuildCalc.setResult('res-plank-sqft', BuildCalc.fmt(plankSqFt, 3) + ' sq ft');
    BuildCalc.setResult('res-planks', BuildCalc.fmt(totalPlanks, 0) + ' planks');
    BuildCalc.setResult('res-boxes', boxes + ' boxes (' + boxCoverage + ' sq ft each)');
    BuildCalc.setResult('res-cost', costPerBox > 0 ? '$' + BuildCalc.fmt(totalCost) : 'Enter price above');
    BuildCalc.setResult('res-highlight', boxes + ' boxes of flooring (' + BuildCalc.fmt(totalSqFt, 0) + ' sq ft)');

    BuildCalc.showResults('results');
  });
});
