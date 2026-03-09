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
    TradeTools.clearErrors();
    const coats = TradeTools.getPositive('coats');
    const doors = TradeTools.getInt('doors');
    const windows = TradeTools.getInt('windows');
    if (!coats || doors === null || windows === null) return;

    let totalSqFt;
    if (modeSelect.value === 'room') {
      const l = TradeTools.getPositive('room-length');
      const w = TradeTools.getPositive('room-width');
      const h = TradeTools.getPositive('room-height');
      if (!l || !w || !h) return;
      const wallArea = 2 * (l + w) * h;
      totalSqFt = wallArea;
    } else {
      totalSqFt = TradeTools.getPositive('total-sqft');
      if (!totalSqFt) return;
    }

    const doorDeduct = doors * 21;
    const windowDeduct = windows * 15;
    const netArea = Math.max(0, totalSqFt - doorDeduct - windowDeduct);
    const paintableArea = netArea * coats;
    const coverage = 350; // sq ft per gallon
    const gallons = paintableArea / coverage;
    const gallonsRounded = Math.ceil(gallons);

    TradeTools.setResult('res-gross-area', TradeTools.fmt(totalSqFt, 0) + ' sq ft');
    TradeTools.setResult('res-deductions', TradeTools.fmt(doorDeduct + windowDeduct, 0) + ' sq ft');
    TradeTools.setResult('res-net-area', TradeTools.fmt(netArea, 0) + ' sq ft');
    TradeTools.setResult('res-coats', coats);
    TradeTools.setResult('res-total-coverage', TradeTools.fmt(paintableArea, 0) + ' sq ft');
    TradeTools.setResult('res-gallons-exact', TradeTools.fmt(gallons) + ' gallons');
    TradeTools.setResult('res-gallons', gallonsRounded + ' gallons');
    TradeTools.setResult('res-highlight', gallonsRounded + ' gallons needed');

    TradeTools.showResults('results');
  });
});
