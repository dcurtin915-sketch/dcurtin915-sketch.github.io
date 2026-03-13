document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('room-length');
    const width = BuildCalc.getPositive('room-width');
    const ceilingHeight = BuildCalc.getPositive('ceiling-height');
    if (!length || !width || !ceilingHeight) return;

    const areaSqFt = length * width;

    // Blade span based on room area (industry standard sizing)
    let spanMin, spanMax, spanLabel;
    let fansNeeded = 1;

    if (areaSqFt <= 75) {
      spanMin = 29; spanMax = 36; spanLabel = '29–36 inches';
    } else if (areaSqFt <= 144) {
      spanMin = 36; spanMax = 42; spanLabel = '36–42 inches';
    } else if (areaSqFt <= 225) {
      spanMin = 44; spanMax = 50; spanLabel = '44–50 inches';
    } else if (areaSqFt <= 400) {
      spanMin = 50; spanMax = 54; spanLabel = '50–54 inches';
    } else {
      spanMin = 54; spanMax = 72; spanLabel = '54–72 inches';
      fansNeeded = Math.ceil(areaSqFt / 400);
    }

    // Minimum CFM recommendation (moderate airflow ~1.5 CFM/sqft)
    var minCFM = Math.round(areaSqFt * 1.5);

    // Mount type based on ceiling height
    let mountType, clearanceNote;
    if (ceilingHeight < 7.5) {
      mountType = 'Low-profile / Hugger mount (flush to ceiling)';
      clearanceNote = '⚠️ Ceiling may be too low — ensure 7 ft blade clearance from floor';
    } else if (ceilingHeight <= 8) {
      mountType = 'Flush mount (no downrod)';
      clearanceNote = 'Blades will be ~7.5 ft from floor';
    } else if (ceilingHeight <= 9) {
      mountType = 'Standard downrod (3–6 inches)';
      clearanceNote = 'Blades will be ~8 ft from floor';
    } else if (ceilingHeight <= 12) {
      var rodLength = Math.round((ceilingHeight - 8) * 12);
      mountType = 'Extended downrod (' + rodLength + ' inches recommended)';
      clearanceNote = 'Blades should hang 8–9 ft from floor';
    } else {
      var rodLength = Math.round((ceilingHeight - 8.5) * 12);
      mountType = 'Long downrod (' + rodLength + ' inches recommended)';
      clearanceNote = 'Blades should hang 8–9 ft from floor';
    }

    BuildCalc.setResult('res-highlight', spanLabel + ' blade span');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-span', spanLabel);
    BuildCalc.setResult('res-cfm', BuildCalc.fmtInt(minCFM) + ' CFM minimum');
    BuildCalc.setResult('res-mount', mountType);
    BuildCalc.setResult('res-fans', fansNeeded + (fansNeeded > 1 ? ' fans recommended' : ' fan'));
    BuildCalc.setResult('res-clearance', clearanceNote);

    BuildCalc.showResults('results');
  });
});
