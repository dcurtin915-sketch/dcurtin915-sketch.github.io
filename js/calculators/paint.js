document.addEventListener('DOMContentLoaded', () => {
  const modeSelect = document.getElementById('input-mode');
  const roomFields = document.getElementById('room-fields');
  const manualFields = document.getElementById('manual-fields');

  modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'room') {
      roomFields.style.display = 'block';
      manualFields.style.display = 'none';
    } else {
      roomFields.style.display = 'none';
      manualFields.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const coats = BuildCalc.getPositive('coats');
    const doors = BuildCalc.getInt('doors');
    const windows = BuildCalc.getInt('windows');
    if (!coats || doors === null || windows === null) return;

    let totalSqFt;
    if (modeSelect.value === 'room') {
      const l = BuildCalc.getPositive('room-length');
      const w = BuildCalc.getPositive('room-width');
      const h = BuildCalc.getPositive('room-height');
      if (!l || !w || !h) return;
      const wallArea = 2 * (l + w) * h;
      totalSqFt = wallArea;
    } else {
      totalSqFt = BuildCalc.getPositive('total-sqft');
      if (!totalSqFt) return;
    }

    const doorDeduct = doors * 21;
    const windowDeduct = windows * 15;
    const netArea = Math.max(0, totalSqFt - doorDeduct - windowDeduct);
    const paintableArea = netArea * coats;
    const coverage = 350; // sq ft per gallon
    const gallons = paintableArea / coverage;
    const gallonsRounded = Math.ceil(gallons);

    BuildCalc.setResult('res-gross-area', BuildCalc.fmt(totalSqFt, 0) + ' sq ft');
    BuildCalc.setResult('res-deductions', BuildCalc.fmt(doorDeduct + windowDeduct, 0) + ' sq ft');
    BuildCalc.setResult('res-net-area', BuildCalc.fmt(netArea, 0) + ' sq ft');
    BuildCalc.setResult('res-coats', coats);
    BuildCalc.setResult('res-total-coverage', BuildCalc.fmt(paintableArea, 0) + ' sq ft');
    BuildCalc.setResult('res-gallons-exact', BuildCalc.fmt(gallons) + ' gallons');
    BuildCalc.setResult('res-gallons', gallonsRounded + ' gallons');
    BuildCalc.setResult('res-highlight', gallonsRounded + ' gallons needed');

    BuildCalc.showResults('results');
  });
});
