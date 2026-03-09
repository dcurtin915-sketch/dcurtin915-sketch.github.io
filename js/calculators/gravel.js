document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const length = BuildCalc.getPositive('length');
    const width = BuildCalc.getPositive('width');
    const depth = BuildCalc.getPositive('depth');
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

    BuildCalc.setResult('res-material', mat.name);
    BuildCalc.setResult('res-dimensions', `${BuildCalc.fmt(length)} ft × ${BuildCalc.fmt(width)} ft × ${BuildCalc.fmt(depth)} in`);
    BuildCalc.setResult('res-area', BuildCalc.fmt(length * width) + ' sq ft');
    BuildCalc.setResult('res-cuft', BuildCalc.fmt(volumeCuFt) + ' cubic feet');
    BuildCalc.setResult('res-cuyd', BuildCalc.fmt(volumeCuYd) + ' cubic yards');
    BuildCalc.setResult('res-density', mat.density + ' tons/cu yd');
    BuildCalc.setResult('res-tons', BuildCalc.fmt(tons) + ' tons');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(tons) + ' tons of ' + mat.name.toLowerCase());

    BuildCalc.showResults('results');
  });
});
