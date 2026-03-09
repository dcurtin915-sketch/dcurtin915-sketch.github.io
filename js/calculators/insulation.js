document.addEventListener('DOMContentLoaded', () => {
  const inputMethod = document.getElementById('input-method');
  const dimFields = document.getElementById('dim-fields');
  const sqftField = document.getElementById('sqft-field');

  inputMethod.addEventListener('change', () => {
    if (inputMethod.value === 'dimensions') {
      dimFields.style.display = 'block';
      sqftField.style.display = 'none';
    } else {
      dimFields.style.display = 'none';
      sqftField.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    let areaSqFt;

    if (inputMethod.value === 'dimensions') {
      const length = TradeTools.getPositive('room-length');
      const height = TradeTools.getPositive('room-height');
      if (!length || !height) return;
      areaSqFt = length * height;
    } else {
      areaSqFt = TradeTools.getPositive('total-sqft');
      if (!areaSqFt) return;
    }

    const studSpacing = parseFloat(document.getElementById('stud-spacing').value);
    const insulationType = document.getElementById('insulation-type').value;
    const application = document.getElementById('application').value;

    // R-values and coverage by type and application
    const specs = {
      batt: {
        wall: { rValue: 13, thickness: '3.5″', coverage: 88.12 }, // sq ft per bundle (16" OC, R-13)
        attic: { rValue: 30, thickness: '9.5″', coverage: 48.96 },
        ceiling: { rValue: 38, thickness: '12″', coverage: 48.96 }
      },
      blown: {
        wall: { rValue: 13, thickness: '3.5″', coverage: 40 }, // sq ft per bag at R-13
        attic: { rValue: 30, thickness: '8.3″', coverage: 17.8 },
        ceiling: { rValue: 38, thickness: '10.5″', coverage: 14 }
      },
      spray: {
        wall: { rValue: 13, thickness: '2.1″', coverage: 200 }, // sq ft per kit at 1" (board feet)
        attic: { rValue: 30, thickness: '4.8″', coverage: 200 },
        ceiling: { rValue: 38, thickness: '6.1″', coverage: 200 }
      }
    };

    const spec = specs[insulationType][application];

    // Adjust batt coverage for stud spacing
    let adjustedCoverage = spec.coverage;
    if (insulationType === 'batt' && studSpacing === 24) {
      // 24" OC batts are wider, slightly different coverage
      adjustedCoverage = spec.coverage * 1.05;
    }

    let units, unitLabel, unitsNeeded;
    if (insulationType === 'batt') {
      unitsNeeded = Math.ceil(areaSqFt / adjustedCoverage);
      unitLabel = 'bundles';
    } else if (insulationType === 'blown') {
      unitsNeeded = Math.ceil(areaSqFt / adjustedCoverage);
      unitLabel = 'bags';
    } else {
      // Spray foam: board feet = sq ft × thickness in inches
      const boardFeet = areaSqFt * parseFloat(spec.thickness);
      unitsNeeded = Math.ceil(boardFeet / adjustedCoverage);
      unitLabel = 'kits (200 board ft)';
    }

    const typeLabels = { batt: 'Fiberglass Batt', blown: 'Blown-In (Cellulose)', spray: 'Spray Foam (Closed Cell)' };
    const appLabels = { wall: 'Walls', attic: 'Attic', ceiling: 'Cathedral Ceiling' };

    TradeTools.setResult('res-highlight', unitsNeeded + ' ' + unitLabel);
    TradeTools.setResult('res-area', TradeTools.fmt(areaSqFt) + ' sq ft');
    TradeTools.setResult('res-type', typeLabels[insulationType]);
    TradeTools.setResult('res-application', appLabels[application]);
    TradeTools.setResult('res-rvalue', 'R-' + spec.rValue);
    TradeTools.setResult('res-thickness', spec.thickness);
    TradeTools.setResult('res-stud-spacing', studSpacing + '″ on center');
    TradeTools.setResult('res-units', unitsNeeded + ' ' + unitLabel);
    TradeTools.setResult('res-coverage', TradeTools.fmt(adjustedCoverage) + ' sq ft per ' + (insulationType === 'batt' ? 'bundle' : insulationType === 'blown' ? 'bag' : 'kit'));

    TradeTools.showResults('results');
  });
});
