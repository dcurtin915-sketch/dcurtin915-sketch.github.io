document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('bath-length');
    const width = BuildCalc.getPositive('bath-width');
    const ceilingHeight = BuildCalc.getPositive('ceiling-height');
    if (!length || !width || !ceilingHeight) return;

    const hasTub = document.getElementById('has-tub').value;
    const hasEnclosed = document.getElementById('has-enclosed').value;

    const areaSqFt = length * width;
    const volumeCuFt = areaSqFt * ceilingHeight;

    // Per code: bathrooms ≤100 sq ft = 50 CFM minimum
    // Bathrooms >100 sq ft = 1 CFM per sq ft
    let minCFM;
    let method;

    if (areaSqFt <= 100) {
      minCFM = 50;
      method = 'Code minimum (50 CFM for ≤100 sq ft)';
    } else {
      minCFM = Math.ceil(areaSqFt);
      method = '1 CFM per sq ft (>100 sq ft bathroom)';
    }

    // Adjustments for fixtures
    let recCFM = minCFM;
    if (hasTub === 'jetted') {
      recCFM = Math.max(recCFM, 100); // jetted tubs produce more moisture
    } else if (hasTub === 'tub' || hasTub === 'shower') {
      recCFM = Math.max(recCFM, 50);
    }

    // If enclosed areas, add 50 CFM for each
    if (hasEnclosed === 'yes') {
      recCFM += 50;
    }

    // Round up to nearest standard fan size (50, 70, 80, 100, 110, 150)
    var standardSizes = [50, 70, 80, 100, 110, 150, 200, 250, 300];
    var fanSize = recCFM;
    for (var i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= recCFM) {
        fanSize = standardSizes[i];
        break;
      }
    }

    // Duct size
    var ductSize;
    if (fanSize <= 50) {
      ductSize = '3" round';
    } else if (fanSize <= 100) {
      ductSize = '4" round';
    } else if (fanSize <= 150) {
      ductSize = '6" round';
    } else {
      ductSize = '6" or 8" round';
    }

    // ACH (air changes per hour)
    var ach = (fanSize * 60) / volumeCuFt;

    // Sone recommendation
    var soneRec = fanSize <= 80 ? 'Look for 0.5–1.0 sones (quiet)' :
                  fanSize <= 150 ? 'Look for 1.0–2.0 sones (moderate)' :
                  'Look for 2.0–4.0 sones (higher CFM is louder)';

    BuildCalc.setResult('res-highlight', fanSize + ' CFM exhaust fan');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-volume', BuildCalc.fmt(volumeCuFt) + ' cu ft');
    BuildCalc.setResult('res-method', method);
    BuildCalc.setResult('res-cfm', minCFM + ' CFM minimum per code');
    BuildCalc.setResult('res-rec-cfm', fanSize + ' CFM (nearest standard size)');
    BuildCalc.setResult('res-duct', ductSize);
    BuildCalc.setResult('res-sones', soneRec);
    BuildCalc.setResult('res-ach', BuildCalc.fmt(ach) + ' ACH (target ≥8)');

    BuildCalc.showResults('results');
  });
});
