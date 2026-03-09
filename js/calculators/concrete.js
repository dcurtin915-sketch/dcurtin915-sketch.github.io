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
    TradeTools.clearErrors();
    const shape = shapeSelect.value;
    let volumeCuYd;

    if (shape === 'rectangle') {
      const length = TradeTools.getPositive('length');
      const width = TradeTools.getPositive('width');
      const depth = TradeTools.getPositive('depth');
      if (!length || !width || !depth) return;
      const depthFt = depth / 12;
      const volumeCuFt = length * width * depthFt;
      volumeCuYd = volumeCuFt / 27;

      TradeTools.setResult('res-dimensions', `${TradeTools.fmt(length)} ft × ${TradeTools.fmt(width)} ft × ${TradeTools.fmt(depth)} in`);
      TradeTools.setResult('res-area', TradeTools.fmt(length * width) + ' sq ft');
    } else {
      const diameter = TradeTools.getPositive('diameter');
      const depthC = TradeTools.getPositive('depth-circ');
      if (!diameter || !depthC) return;
      const radius = diameter / 2;
      const area = Math.PI * radius * radius;
      const depthFt = depthC / 12;
      const volumeCuFt = area * depthFt;
      volumeCuYd = volumeCuFt / 27;

      TradeTools.setResult('res-dimensions', `Ø ${TradeTools.fmt(diameter)} ft × ${TradeTools.fmt(depthC)} in deep`);
      TradeTools.setResult('res-area', TradeTools.fmt(area) + ' sq ft');
    }

    const bags60 = Math.ceil(volumeCuYd * 27 / 0.45);
    const bags80 = Math.ceil(volumeCuYd * 27 / 0.6);

    TradeTools.setResult('res-cuyd', TradeTools.fmt(volumeCuYd) + ' cubic yards');
    TradeTools.setResult('res-cuft', TradeTools.fmt(volumeCuYd * 27) + ' cubic feet');
    TradeTools.setResult('res-bags60', bags60 + ' bags (60 lb)');
    TradeTools.setResult('res-bags80', bags80 + ' bags (80 lb)');
    TradeTools.setResult('res-highlight', TradeTools.fmt(volumeCuYd) + ' cubic yards');

    TradeTools.showResults('results');
  });
});
