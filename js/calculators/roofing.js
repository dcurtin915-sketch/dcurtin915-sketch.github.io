document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const length = TradeTools.getPositive('roof-length');
    const width = TradeTools.getPositive('roof-width');
    const rise = TradeTools.getNum('pitch-rise');
    const run = TradeTools.getPositive('pitch-run');
    const waste = TradeTools.getNum('waste-pct');
    if (!length || !width || rise === null || !run || waste === null) return;

    // Pitch multiplier: sqrt(rise² + run²) / run
    const pitchMultiplier = Math.sqrt(rise * rise + run * run) / run;
    const footprintArea = length * width;
    const actualArea = footprintArea * pitchMultiplier;
    const wasteArea = actualArea * (1 + waste / 100);

    // 1 square = 100 sq ft
    const squares = wasteArea / 100;
    // 3 bundles per square for 3-tab shingles
    const bundles = Math.ceil(squares * 3);
    // Underlayment: 4 sq ft rolls cover ~400 sq ft each (1 roll = 4 squares)
    const underlaymentRolls = Math.ceil(squares / 4);
    // Ridge cap: roughly perimeter / 35 ft per bundle
    const ridgeLength = length; // simplified: ridge = length
    const ridgeCapBundles = Math.ceil(ridgeLength / 35);
    // Nails: ~320 nails per square (about 2.5 lbs per square)
    const nailsLbs = Math.ceil(squares * 2.5);

    const pitch = rise + ':' + run;

    TradeTools.setResult('res-footprint', TradeTools.fmt(footprintArea, 0) + ' sq ft');
    TradeTools.setResult('res-pitch', pitch + ' (' + TradeTools.fmt(pitchMultiplier, 3) + 'x multiplier)');
    TradeTools.setResult('res-actual-area', TradeTools.fmt(actualArea, 0) + ' sq ft');
    TradeTools.setResult('res-waste', waste + '% (' + TradeTools.fmt(wasteArea, 0) + ' sq ft total)');
    TradeTools.setResult('res-squares', TradeTools.fmt(squares) + ' squares');
    TradeTools.setResult('res-bundles', bundles + ' bundles (3-tab)');
    TradeTools.setResult('res-underlayment', underlaymentRolls + ' rolls');
    TradeTools.setResult('res-ridgecap', ridgeCapBundles + ' bundles');
    TradeTools.setResult('res-nails', nailsLbs + ' lbs');
    TradeTools.setResult('res-highlight', TradeTools.fmt(squares) + ' squares of shingles');

    TradeTools.showResults('results');
  });
});
