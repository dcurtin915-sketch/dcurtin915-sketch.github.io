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
    BuildCalc.clearErrors();
    let areaSqFt;

    if (inputMethod.value === 'dimensions') {
      const length = BuildCalc.getPositive('area-length');
      const width = BuildCalc.getPositive('area-width');
      if (!length || !width) return;
      areaSqFt = length * width;
    } else {
      areaSqFt = BuildCalc.getPositive('total-sqft');
      if (!areaSqFt) return;
    }

    const coverageRate = parseFloat(document.getElementById('sealer-type').value);
    const numCoats = parseInt(document.getElementById('num-coats').value);
    const costPerGallon = BuildCalc.getNum('cost-per-gallon');

    const sealerTypeEl = document.getElementById('sealer-type');
    const sealerLabel = sealerTypeEl.options[sealerTypeEl.selectedIndex].text;

    const gallonsPerCoat = areaSqFt / coverageRate;
    const totalGallons = gallonsPerCoat * numCoats;
    const gallonsRoundUp = Math.ceil(totalGallons);

    const totalCost = costPerGallon !== null && costPerGallon > 0
      ? gallonsRoundUp * costPerGallon
      : null;

    BuildCalc.setResult('res-highlight', gallonsRoundUp + ' gallon' + (gallonsRoundUp !== 1 ? 's' : '') + ' of sealer');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-coverage', coverageRate + ' sq ft per gallon');
    BuildCalc.setResult('res-per-coat', BuildCalc.fmt(gallonsPerCoat) + ' gallons');
    BuildCalc.setResult('res-coats', numCoats + ' coat' + (numCoats > 1 ? 's' : ''));
    BuildCalc.setResult('res-total-gal', gallonsRoundUp + ' gallons (rounded up)');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerGallon) + '/gal');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
