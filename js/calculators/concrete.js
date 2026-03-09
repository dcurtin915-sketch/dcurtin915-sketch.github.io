document.addEventListener('DOMContentLoaded', () => {
  const shapeSelect = document.getElementById('shape');
  const rectFields = document.getElementById('rect-fields');
  const circFields = document.getElementById('circ-fields');

  shapeSelect.addEventListener('change', () => {
    if (shapeSelect.value === 'rectangle') {
      rectFields.style.display = 'block';
      circFields.style.display = 'none';
    } else {
      rectFields.style.display = 'none';
      circFields.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const shape = shapeSelect.value;
    let volumeCuYd;

    if (shape === 'rectangle') {
      const length = BuildCalc.getPositive('length');
      const width = BuildCalc.getPositive('width');
      const depth = BuildCalc.getPositive('depth');
      if (!length || !width || !depth) return;
      const depthFt = depth / 12;
      const volumeCuFt = length * width * depthFt;
      volumeCuYd = volumeCuFt / 27;

      BuildCalc.setResult('res-dimensions', `${BuildCalc.fmt(length)} ft × ${BuildCalc.fmt(width)} ft × ${BuildCalc.fmt(depth)} in`);
      BuildCalc.setResult('res-area', BuildCalc.fmt(length * width) + ' sq ft');
    } else {
      const diameter = BuildCalc.getPositive('diameter');
      const depthC = BuildCalc.getPositive('depth-circ');
      if (!diameter || !depthC) return;
      const radius = diameter / 2;
      const area = Math.PI * radius * radius;
      const depthFt = depthC / 12;
      const volumeCuFt = area * depthFt;
      volumeCuYd = volumeCuFt / 27;

      BuildCalc.setResult('res-dimensions', `Ø ${BuildCalc.fmt(diameter)} ft × ${BuildCalc.fmt(depthC)} in deep`);
      BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    }

    const bags60 = Math.ceil(volumeCuYd * 27 / 0.45);
    const bags80 = Math.ceil(volumeCuYd * 27 / 0.6);

    BuildCalc.setResult('res-cuyd', BuildCalc.fmt(volumeCuYd) + ' cubic yards');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(volumeCuYd * 27) + ' cubic feet');
    BuildCalc.setResult('res-bags60', bags60 + ' bags (60 lb)');
    BuildCalc.setResult('res-bags80', bags80 + ' bags (80 lb)');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(volumeCuYd) + ' cubic yards');

    BuildCalc.showResults('results');
  });
});
