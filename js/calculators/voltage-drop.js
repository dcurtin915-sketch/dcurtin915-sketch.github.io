document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const amps = BuildCalc.getPositive('amps');
    const distance = BuildCalc.getPositive('distance');
    if (!amps || !distance) return;

    const voltage = parseFloat(document.getElementById('voltage').value);
    const phase = parseInt(document.getElementById('phase').value);
    const wireSize = document.getElementById('wireSize').value;
    const material = document.getElementById('material').value;

    // Resistance per 1000 ft at 75°C — NEC Chapter 9 Table 8 (uncoated)
    const copperR = {
      '14': 3.14, '12': 1.98, '10': 1.24, '8': 0.778,
      '6': 0.491, '4': 0.308, '3': 0.245, '2': 0.194,
      '1': 0.154, '1/0': 0.122, '2/0': 0.0967, '3/0': 0.0766, '4/0': 0.0608
    };
    const aluminumR = {
      '14': 5.17, '12': 3.25, '10': 2.04, '8': 1.28,
      '6': 0.808, '4': 0.508, '3': 0.403, '2': 0.319,
      '1': 0.253, '1/0': 0.201, '2/0': 0.159, '3/0': 0.126, '4/0': 0.100
    };

    const rTable = material === 'copper' ? copperR : aluminumR;
    const rPer1000 = rTable[wireSize];

    // Voltage drop formula
    // Single phase: VD = 2 × L × R × I / 1000
    // Three phase: VD = √3 × L × R × I / 1000
    const multiplier = phase === 1 ? 2 : Math.sqrt(3);
    const vDrop = multiplier * distance * rPer1000 * amps / 1000;
    const dropPct = (vDrop / voltage) * 100;
    const loadVoltage = voltage - vDrop;

    const nec3pass = dropPct <= 3;
    const nec5pass = dropPct <= 5;

    BuildCalc.setResult('res-resistance', rPer1000 + ' Ω/1000 ft (' + material + ')');
    BuildCalc.setResult('res-wirelength', BuildCalc.fmt(distance * 2) + ' ft total (round trip)');
    BuildCalc.setResult('res-drop', BuildCalc.fmt(vDrop) + ' volts');
    BuildCalc.setResult('res-pct', BuildCalc.fmt(dropPct) + '%');
    BuildCalc.setResult('res-loadv', BuildCalc.fmt(loadVoltage) + ' V');
    BuildCalc.setResult('res-nec3', nec3pass ? '✅ PASS (' + BuildCalc.fmt(dropPct) + '% ≤ 3%)' : '❌ FAIL (' + BuildCalc.fmt(dropPct) + '% > 3%)');
    BuildCalc.setResult('res-nec5', nec5pass ? '✅ PASS (' + BuildCalc.fmt(dropPct) + '% ≤ 5%)' : '❌ FAIL (' + BuildCalc.fmt(dropPct) + '% > 5%)');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(vDrop) + 'V drop (' + BuildCalc.fmt(dropPct) + '%) — ' + (nec3pass ? '✅ NEC OK' : nec5pass ? '⚠️ Over 3%' : '❌ Over 5%'));

    BuildCalc.showResults('results');
  });
});
