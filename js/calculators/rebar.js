document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const slabLength = BuildCalc.getPositive('slabLength');
    const slabWidth = BuildCalc.getPositive('slabWidth');
    const barLength = BuildCalc.getPositive('barLength');
    if (!slabLength || !slabWidth || !barLength) return;

    const spacing = parseFloat(document.getElementById('spacing').value);
    const barSize = parseInt(document.getElementById('barSize').value);
    const grid = document.getElementById('grid').value;

    // Bar weights in lb/ft
    const weights = { 3: 0.376, 4: 0.668, 5: 1.043, 6: 1.502, 7: 2.044, 8: 2.670 };
    // Bar diameters in inches (bar number / 8)
    const diameters = { 3: 0.375, 4: 0.500, 5: 0.625, 6: 0.750, 7: 0.875, 8: 1.000 };

    const spacingFt = spacing / 12;

    // Bars running along the length (spaced across the width)
    const barsL = Math.floor(slabWidth / spacingFt) + 1;
    // Bars running along the width (spaced across the length)
    const barsW = grid === 'grid' ? Math.floor(slabLength / spacingFt) + 1 : 0;

    const linearFtL = barsL * slabLength;
    const linearFtW = barsW * slabWidth;
    const totalLinearFt = linearFtL + linearFtW;

    const stockBars = Math.ceil(totalLinearFt / barLength);
    const totalWeight = totalLinearFt * weights[barSize];

    // Lap splice: ACI 318 minimum = 40 × bar diameter
    const lapSplice = 40 * diameters[barSize];

    const area = slabLength * slabWidth;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-barsL', barsL + ' bars × ' + BuildCalc.fmt(slabLength) + ' ft = ' + BuildCalc.fmt(linearFtL) + ' lin ft');
    BuildCalc.setResult('res-barsW', grid === 'grid' ? barsW + ' bars × ' + BuildCalc.fmt(slabWidth) + ' ft = ' + BuildCalc.fmt(linearFtW) + ' lin ft' : 'N/A (one-way)');
    BuildCalc.setResult('res-linft', BuildCalc.fmt(totalLinearFt) + ' linear feet');
    BuildCalc.setResult('res-stockbars', stockBars + ' × ' + BuildCalc.fmt(barLength) + ' ft bars');
    BuildCalc.setResult('res-weight', BuildCalc.fmt(totalWeight) + ' lbs (' + BuildCalc.fmt(totalWeight / 2000) + ' tons)');
    BuildCalc.setResult('res-lap', BuildCalc.fmt(lapSplice) + ' inches (#' + barSize + ' bar)');
    BuildCalc.setResult('res-highlight', stockBars + ' stock bars — ' + BuildCalc.fmt(totalWeight, 0) + ' lbs of #' + barSize + ' rebar');

    BuildCalc.showResults('results');
  });
});
