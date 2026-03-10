document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const roofLength = BuildCalc.getPositive('roofLength');
    const roofWidth = BuildCalc.getPositive('roofWidth');
    if (!roofLength || !roofWidth) return;

    const pitchFactor = parseFloat(document.getElementById('pitch').value);
    const rainfall = parseFloat(document.getElementById('rainfall').value);
    const sides = parseInt(document.getElementById('gutterSides').value);
    const pricePerFt = parseFloat(document.getElementById('pricePerFt').value) || 0;

    // Adjusted roof drainage area
    const adjustedArea = roofLength * roofWidth * pitchFactor;
    const drainagePerSide = adjustedArea / sides;

    // Gutter sizing based on SMACNA standards (sq ft at design rainfall)
    // 5" K-style: max 5,520 sq ft per downspout at 6 in/hr
    // 6" K-style: max 7,960 sq ft per downspout at 6 in/hr
    // Scale by rainfall ratio (6 in/hr baseline)
    const rainfallRatio = rainfall / 6;
    const effectiveDrainage = drainagePerSide * rainfallRatio;

    let gutterSize, downspoutSize, maxPerDownspout;
    if (effectiveDrainage <= 5520) {
      gutterSize = '5" K-Style';
      downspoutSize = '2×3"';
      maxPerDownspout = 5520 / rainfallRatio;
    } else if (effectiveDrainage <= 7960) {
      gutterSize = '6" K-Style';
      downspoutSize = '3×4"';
      maxPerDownspout = 7960 / rainfallRatio;
    } else {
      gutterSize = '6" Half-Round or Commercial';
      downspoutSize = '4" round';
      maxPerDownspout = 10000 / rainfallRatio;
    }

    const totalGutterLength = roofLength * sides;

    // Downspouts: 1 per 20 ft for 2×3, 1 per 30 ft for 3×4+
    const downspoutSpacing = downspoutSize === '2×3"' ? 20 : 30;
    const downspoutsPerSide = Math.max(2, Math.ceil(roofLength / downspoutSpacing));
    const totalDownspouts = downspoutsPerSide * sides;

    // End caps: 2 per gutter run
    const endCaps = 2 * sides;
    // Hangers every 3 ft
    const hangers = Math.ceil(totalGutterLength / 3);

    const cost = totalGutterLength * pricePerFt;

    BuildCalc.setResult('res-area', BuildCalc.fmt(adjustedArea) + ' sq ft');
    BuildCalc.setResult('res-drainage', BuildCalc.fmt(drainagePerSide) + ' sq ft per side');
    BuildCalc.setResult('res-guttersize', gutterSize + ' with ' + downspoutSize + ' downspouts');
    BuildCalc.setResult('res-length', BuildCalc.fmt(totalGutterLength) + ' linear feet');
    BuildCalc.setResult('res-downspouts', totalDownspouts + ' downspouts (' + downspoutSize + ')');
    BuildCalc.setResult('res-corners', '0 (straight runs — add as needed)');
    BuildCalc.setResult('res-endcaps', endCaps + ' end caps');
    BuildCalc.setResult('res-hangers', hangers + ' hangers');
    BuildCalc.setResult('res-cost', pricePerFt > 0 ? BuildCalc.fmtCurrency(cost) : '—');
    BuildCalc.setResult('res-highlight', gutterSize + ' — ' + BuildCalc.fmt(totalGutterLength, 0) + ' ft with ' + totalDownspouts + ' downspouts');

    BuildCalc.showResults('results');
  });
});
