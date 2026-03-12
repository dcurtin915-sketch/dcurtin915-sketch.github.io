document.addEventListener('DOMContentLoaded', () => {
  const calcMode = document.getElementById('calc-mode');
  const dropInputField = document.getElementById('drop-input-field');

  calcMode.addEventListener('change', () => {
    dropInputField.style.display = calcMode.value === 'find-slope' ? 'block' : 'none';
  });

  // Code minimum slopes per IPC/UPC (inches per foot)
  function getCodeMinSlope(diameterInches) {
    if (diameterInches <= 2.5) return 0.25;    // 1/4 in/ft
    if (diameterInches <= 6) return 0.125;      // 1/8 in/ft
    return 0.0625;                               // 1/16 in/ft
  }

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const diameter = parseFloat(document.getElementById('pipe-diameter').value);
    const pipeLength = BuildCalc.getPositive('pipe-length');
    if (!pipeLength) return;

    const codeMin = getCodeMinSlope(diameter);
    const customSlope = BuildCalc.getNum('custom-slope');

    let slopeInPerFt, totalDropInches;

    if (calcMode.value === 'find-slope') {
      totalDropInches = BuildCalc.getPositive('total-drop');
      if (!totalDropInches) return;
      slopeInPerFt = totalDropInches / pipeLength;
    } else {
      slopeInPerFt = (customSlope !== null && customSlope > 0) ? customSlope : codeMin;
      totalDropInches = slopeInPerFt * pipeLength;
    }

    const gradePct = (slopeInPerFt / 12) * 100;
    const meetsCode = slopeInPerFt >= codeMin;

    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalDropInches) + ' inches total drop');
    BuildCalc.setResult('res-diameter', diameter + ' inches');
    BuildCalc.setResult('res-run', BuildCalc.fmt(pipeLength) + ' feet');
    BuildCalc.setResult('res-slope', BuildCalc.fmt(slopeInPerFt) + ' inches per foot');
    BuildCalc.setResult('res-pct', BuildCalc.fmt(gradePct) + '%');
    BuildCalc.setResult('res-drop', BuildCalc.fmt(totalDropInches) + ' inches (' + BuildCalc.fmt(totalDropInches / 12) + ' feet)');
    BuildCalc.setResult('res-code', BuildCalc.fmt(codeMin) + ' in/ft minimum for ' + diameter + '" pipe');
    BuildCalc.setResult('res-compliance', meetsCode ? '✅ Meets code minimum' : '❌ Below code minimum — increase slope');

    BuildCalc.showResults('results');
  });
});
