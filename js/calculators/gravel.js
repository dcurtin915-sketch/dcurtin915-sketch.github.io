document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const length = TradeTools.getPositive('length');
    const width = TradeTools.getPositive('width');
    const depth = TradeTools.getPositive('depth');
    if (!length || !width || !depth) return;

    const material = document.getElementById('material').value;
    const densities = {
      'gravel': { density: 1.4, name: 'Gravel' },
      'sand': { density: 1.35, name: 'Sand' },
      'crushed-stone': { density: 1.5, name: 'Crushed Stone' },
      'topsoil': { density: 1.1, name: 'Topsoil' }
    };
    const mat = densities[material];

    const depthFt = depth / 12;
    const volumeCuFt = length * width * depthFt;
    const volumeCuYd = volumeCuFt / 27;
    const tons = volumeCuYd * mat.density;

    TradeTools.setResult('res-material', mat.name);
    TradeTools.setResult('res-dimensions', `${TradeTools.fmt(length)} ft × ${TradeTools.fmt(width)} ft × ${TradeTools.fmt(depth)} in`);
    TradeTools.setResult('res-area', TradeTools.fmt(length * width) + ' sq ft');
    TradeTools.setResult('res-cuft', TradeTools.fmt(volumeCuFt) + ' cubic feet');
    TradeTools.setResult('res-cuyd', TradeTools.fmt(volumeCuYd) + ' cubic yards');
    TradeTools.setResult('res-density', mat.density + ' tons/cu yd');
    TradeTools.setResult('res-tons', TradeTools.fmt(tons) + ' tons');
    TradeTools.setResult('res-highlight', TradeTools.fmt(tons) + ' tons of ' + mat.name.toLowerCase());

    TradeTools.showResults('results');
  });
});
