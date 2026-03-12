document.addEventListener('DOMContentLoaded', () => {
  const calcDir = document.getElementById('calc-direction');
  const circuitType = document.getElementById('circuit-type');
  const voltageSelect = document.getElementById('voltage');
  const customVoltField = document.getElementById('custom-volt-field');
  const wattsField = document.getElementById('watts-field');
  const ampsField = document.getElementById('amps-field');
  const pfField = document.getElementById('pf-field');

  calcDir.addEventListener('change', () => {
    if (calcDir.value === 'w2a') {
      wattsField.style.display = 'block';
      ampsField.style.display = 'none';
    } else {
      wattsField.style.display = 'none';
      ampsField.style.display = 'block';
    }
  });

  circuitType.addEventListener('change', () => {
    pfField.style.display = circuitType.value === 'dc' ? 'none' : 'block';
  });

  voltageSelect.addEventListener('change', () => {
    customVoltField.style.display = voltageSelect.value === 'custom' ? 'block' : 'none';
  });

  // Standard breaker sizes
  const breakerSizes = [15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 125, 150, 200];

  function suggestBreaker(amps) {
    // NEC requires continuous loads at 80% of breaker rating
    const minBreaker = amps / 0.8;
    for (let i = 0; i < breakerSizes.length; i++) {
      if (breakerSizes[i] >= minBreaker) return breakerSizes[i];
    }
    return Math.ceil(minBreaker);
  }

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    let volts;
    if (voltageSelect.value === 'custom') {
      volts = BuildCalc.getPositive('custom-voltage');
      if (!volts) return;
    } else {
      volts = parseFloat(voltageSelect.value);
    }

    const type = circuitType.value;
    const pf = type === 'dc' ? 1 : parseFloat(document.getElementById('power-factor').value);

    let watts, amps;

    if (calcDir.value === 'w2a') {
      watts = BuildCalc.getPositive('watts');
      if (!watts) return;

      if (type === 'dc') {
        amps = watts / volts;
      } else if (type === 'ac1') {
        amps = watts / (volts * pf);
      } else {
        amps = watts / (volts * Math.sqrt(3) * pf);
      }
    } else {
      amps = BuildCalc.getPositive('amps-input');
      if (!amps) return;

      if (type === 'dc') {
        watts = amps * volts;
      } else if (type === 'ac1') {
        watts = amps * volts * pf;
      } else {
        watts = amps * volts * Math.sqrt(3) * pf;
      }
    }

    const breaker = suggestBreaker(amps);
    const typeLabels = { dc: 'DC', ac1: 'AC Single-Phase', ac3: 'AC Three-Phase' };

    BuildCalc.setResult('res-highlight', BuildCalc.fmt(amps) + ' Amps');
    BuildCalc.setResult('res-watts', BuildCalc.fmt(watts) + ' W (' + BuildCalc.fmt(watts / 1000) + ' kW)');
    BuildCalc.setResult('res-voltage', volts + ' V');
    BuildCalc.setResult('res-type', typeLabels[type]);
    BuildCalc.setResult('res-pf', type === 'dc' ? 'N/A (DC)' : pf);
    BuildCalc.setResult('res-amps', BuildCalc.fmt(amps) + ' A');
    BuildCalc.setResult('res-breaker', breaker + 'A breaker (80% rule: ' + BuildCalc.fmt(breaker * 0.8) + 'A continuous max)');

    BuildCalc.showResults('results');
  });
});
