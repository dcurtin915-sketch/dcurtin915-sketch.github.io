document.addEventListener('DOMContentLoaded', () => {
  const velSelect = document.getElementById('velocity');
  const customVelField = document.getElementById('custom-vel-field');

  velSelect.addEventListener('change', () => {
    customVelField.style.display = velSelect.value === 'custom' ? 'block' : 'none';
  });

  // Standard round duct sizes in inches
  const stdSizes = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36];

  function nextStdSize(diameter) {
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= diameter) return stdSizes[i];
    }
    return Math.ceil(diameter);
  }

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const cfm = BuildCalc.getPositive('cfm');
    if (!cfm) return;

    let velocity;
    if (velSelect.value === 'custom') {
      velocity = BuildCalc.getPositive('custom-velocity');
      if (!velocity) return;
    } else {
      velocity = parseFloat(velSelect.value);
    }

    const rectHeight = BuildCalc.getNum('rect-height');

    // Area in sq ft = CFM / FPM, convert to sq inches (* 144)
    const areaSqIn = (cfm / velocity) * 144;

    // Round duct diameter
    const exactDiameter = Math.sqrt(4 * areaSqIn / Math.PI);
    const stdDiameter = nextStdSize(exactDiameter);

    // Actual area of std duct
    const actualAreaSqIn = Math.PI * Math.pow(stdDiameter / 2, 2);
    const actualVelocity = cfm / (actualAreaSqIn / 144);

    // Noise assessment
    let noise;
    if (actualVelocity <= 600) noise = '✅ Very quiet';
    else if (actualVelocity <= 900) noise = '✅ Acceptable for residential';
    else if (actualVelocity <= 1200) noise = '⚠️ Moderate — may be noisy in living spaces';
    else noise = '❌ High — likely noisy, consider upsizing';

    // Rectangular equivalent
    let rectText = '—';
    if (rectHeight !== null && rectHeight > 0) {
      const rectWidth = Math.ceil(areaSqIn / rectHeight);
      // Round to nearest even inch
      const roundedWidth = Math.ceil(rectWidth / 2) * 2;
      rectText = roundedWidth + '" × ' + rectHeight + '"';
    } else {
      // Suggest common aspect ratios
      const side = Math.ceil(Math.sqrt(areaSqIn));
      const roundedSide = Math.ceil(side / 2) * 2;
      rectText = roundedSide + '" × ' + roundedSide + '" (square) — enter height for custom';
    }

    BuildCalc.setResult('res-highlight', stdDiameter + '" round duct');
    BuildCalc.setResult('res-cfm', BuildCalc.fmt(cfm) + ' CFM');
    BuildCalc.setResult('res-velocity', BuildCalc.fmt(velocity) + ' FPM target');
    BuildCalc.setResult('res-round', stdDiameter + '" diameter (exact: ' + BuildCalc.fmt(exactDiameter) + '")');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqIn) + ' sq in required');
    BuildCalc.setResult('res-rect', rectText);
    BuildCalc.setResult('res-actual-vel', BuildCalc.fmt(actualVelocity) + ' FPM');
    BuildCalc.setResult('res-noise', noise);

    BuildCalc.showResults('results');
  });
});
