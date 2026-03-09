document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const length = BuildCalc.getPositive('roof-length');
    const width = BuildCalc.getPositive('roof-width');
    const rise = BuildCalc.getNum('pitch-rise');
    const run = BuildCalc.getPositive('pitch-run');
    const waste = BuildCalc.getNum('waste-pct');
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

    BuildCalc.setResult('res-footprint', BuildCalc.fmt(footprintArea, 0) + ' sq ft');
    BuildCalc.setResult('res-pitch', pitch + ' (' + BuildCalc.fmt(pitchMultiplier, 3) + 'x multiplier)');
    BuildCalc.setResult('res-actual-area', BuildCalc.fmt(actualArea, 0) + ' sq ft');
    BuildCalc.setResult('res-waste', waste + '% (' + BuildCalc.fmt(wasteArea, 0) + ' sq ft total)');
    BuildCalc.setResult('res-squares', BuildCalc.fmt(squares) + ' squares');
    BuildCalc.setResult('res-bundles', bundles + ' bundles (3-tab)');
    BuildCalc.setResult('res-underlayment', underlaymentRolls + ' rolls');
    BuildCalc.setResult('res-ridgecap', ridgeCapBundles + ' bundles');
    BuildCalc.setResult('res-nails', nailsLbs + ' lbs');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(squares) + ' squares of shingles');

    BuildCalc.showResults('results');
  });
});
