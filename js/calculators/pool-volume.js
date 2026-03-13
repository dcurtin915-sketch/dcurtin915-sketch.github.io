document.addEventListener('DOMContentLoaded', () => {
  const shapeSelect = document.getElementById('pool-shape');
  const rectFields = document.getElementById('rect-fields');
  const roundFields = document.getElementById('round-fields');
  const ovalFields = document.getElementById('oval-fields');

  shapeSelect.addEventListener('change', () => {
    rectFields.style.display = shapeSelect.value === 'rect' ? 'block' : 'none';
    roundFields.style.display = shapeSelect.value === 'round' ? 'block' : 'none';
    ovalFields.style.display = shapeSelect.value === 'oval' ? 'block' : 'none';
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const shape = shapeSelect.value;
    const shallowDepth = BuildCalc.getPositive('shallow-depth');
    const deepDepth = BuildCalc.getPositive('deep-depth');
    if (!shallowDepth || !deepDepth) return;

    const avgDepth = (shallowDepth + deepDepth) / 2;
    let surfaceArea, volumeCuFt;

    if (shape === 'rect') {
      const length = BuildCalc.getPositive('pool-length');
      const width = BuildCalc.getPositive('pool-width');
      if (!length || !width) return;
      surfaceArea = length * width;
      volumeCuFt = surfaceArea * avgDepth;
    } else if (shape === 'round') {
      const diameter = BuildCalc.getPositive('pool-diameter');
      if (!diameter) return;
      const radius = diameter / 2;
      surfaceArea = Math.PI * radius * radius;
      volumeCuFt = surfaceArea * avgDepth;
    } else { // oval
      const longAxis = BuildCalc.getPositive('oval-length');
      const shortAxis = BuildCalc.getPositive('oval-width');
      if (!longAxis || !shortAxis) return;
      surfaceArea = Math.PI * (longAxis / 2) * (shortAxis / 2);
      volumeCuFt = surfaceArea * avgDepth;
    }

    const gallons = volumeCuFt * 7.48052;
    const liters = gallons * 3.78541;

    // Fill time: avg garden hose ~9 GPM = 540 GPH
    const fillHours = gallons / 540;
    let fillTimeStr;
    if (fillHours < 1) {
      fillTimeStr = Math.round(fillHours * 60) + ' minutes';
    } else if (fillHours < 48) {
      fillTimeStr = BuildCalc.fmt(fillHours) + ' hours';
    } else {
      fillTimeStr = BuildCalc.fmt(fillHours / 24) + ' days';
    }
    fillTimeStr += ' @ 9 GPM';

    BuildCalc.setResult('res-highlight', BuildCalc.fmtInt(Math.round(gallons)) + ' gallons');
    BuildCalc.setResult('res-surface', BuildCalc.fmt(surfaceArea) + ' sq ft');
    BuildCalc.setResult('res-avg-depth', BuildCalc.fmt(avgDepth) + ' ft');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(volumeCuFt) + ' cu ft');
    BuildCalc.setResult('res-gallons', BuildCalc.fmtInt(Math.round(gallons)) + ' gallons');
    BuildCalc.setResult('res-liters', BuildCalc.fmtInt(Math.round(liters)) + ' liters');
    BuildCalc.setResult('res-fill-time', fillTimeStr);

    BuildCalc.showResults('results');
  });
});
