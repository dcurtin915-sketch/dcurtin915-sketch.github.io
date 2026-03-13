document.addEventListener('DOMContentLoaded', () => {
  const inputMethod = document.getElementById('input-method');
  const kwhField = document.getElementById('kwh-field');
  const billField = document.getElementById('bill-field');

  inputMethod.addEventListener('change', () => {
    if (inputMethod.value === 'kwh') {
      kwhField.style.display = 'block';
      billField.style.display = 'none';
    } else {
      kwhField.style.display = 'none';
      billField.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    let monthlyKWh;

    if (inputMethod.value === 'kwh') {
      monthlyKWh = BuildCalc.getPositive('monthly-kwh');
      if (!monthlyKWh) return;
    } else {
      const bill = BuildCalc.getPositive('monthly-bill');
      const rate = BuildCalc.getPositive('rate-per-kwh');
      if (!bill || !rate) return;
      monthlyKWh = bill / rate;
    }

    const sunHours = parseFloat(document.getElementById('sun-hours').value);
    const panelWattage = parseFloat(document.getElementById('panel-wattage').value);
    const offsetPct = (BuildCalc.getNum('offset-pct') || 100) / 100;

    const annualKWh = monthlyKWh * 12;
    const targetKWh = annualKWh * offsetPct;
    const dailyKWh = targetKWh / 365;

    // System size accounting for 20% losses
    const systemKW = dailyKWh / sunHours / 0.80;
    const systemWatts = systemKW * 1000;
    const panels = Math.ceil(systemWatts / panelWattage);

    // Roof space: ~17.5 sq ft per panel
    const roofSqFt = panels * 17.5;

    // Annual production
    const annualProduction = systemKW * sunHours * 365 * 0.80;

    // Savings (use national avg $0.13/kWh if from kWh input)
    const rateForSavings = inputMethod.value === 'bill'
      ? (BuildCalc.getNum('rate-per-kwh') || 0.13)
      : 0.13;
    const annualSavings = annualProduction * rateForSavings;

    // System cost estimate ($2.50–$3.50/watt installed, use $3.00 avg)
    const systemCost = systemWatts * 3.00;

    BuildCalc.setResult('res-highlight', panels + ' panels (' + BuildCalc.fmt(systemKW) + ' kW system)');
    BuildCalc.setResult('res-annual-kwh', BuildCalc.fmtInt(Math.round(annualKWh)) + ' kWh/year');
    BuildCalc.setResult('res-offset', Math.round(offsetPct * 100) + '% of usage');
    BuildCalc.setResult('res-system-kw', BuildCalc.fmt(systemKW) + ' kW DC');
    BuildCalc.setResult('res-panels', panels + ' × ' + panelWattage + 'W panels');
    BuildCalc.setResult('res-roof', BuildCalc.fmtInt(Math.round(roofSqFt)) + ' sq ft needed');
    BuildCalc.setResult('res-production', BuildCalc.fmtInt(Math.round(annualProduction)) + ' kWh/year');
    BuildCalc.setResult('res-savings', BuildCalc.fmtCurrency(annualSavings) + '/year @ $' + rateForSavings.toFixed(2) + '/kWh');
    BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(systemCost) + ' (before incentives, ~$3.00/W)');

    BuildCalc.showResults('results');
  });
});
