document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const amps = TradeTools.getPositive('amperage');
    const distance = TradeTools.getPositive('distance');
    if (!amps || !distance) return;

    const voltage = parseFloat(document.getElementById('voltage').value);
    const material = document.getElementById('wire-material').value;

    // Resistivity: circular mil-feet per ohm
    // Copper: 10.4 ohm·cmil/ft, Aluminum: 17.0 ohm·cmil/ft
    const resistivity = material === 'copper' ? 10.4 : 17.0;

    // Max voltage drop 3% per NEC recommendation
    const maxDrop = voltage * 0.03;

    // Required circular mils = (2 × distance × resistivity × amps) / maxDrop
    // Factor of 2 for round-trip
    const requiredCmil = (2 * distance * resistivity * amps) / maxDrop;

    // AWG wire gauge table: gauge -> circular mils
    const gaugeTable = [
      { awg: '14', cmil: 4110, maxAmps30C: 15 },
      { awg: '12', cmil: 6530, maxAmps30C: 20 },
      { awg: '10', cmil: 10380, maxAmps30C: 30 },
      { awg: '8', cmil: 16510, maxAmps30C: 40 },
      { awg: '6', cmil: 26240, maxAmps30C: 55 },
      { awg: '4', cmil: 41740, maxAmps30C: 70 },
      { awg: '3', cmil: 52620, maxAmps30C: 85 },
      { awg: '2', cmil: 66360, maxAmps30C: 95 },
      { awg: '1', cmil: 83690, maxAmps30C: 110 },
      { awg: '1/0', cmil: 105600, maxAmps30C: 125 },
      { awg: '2/0', cmil: 133100, maxAmps30C: 145 },
      { awg: '3/0', cmil: 167800, maxAmps30C: 165 },
      { awg: '4/0', cmil: 211600, maxAmps30C: 195 },
      { awg: '250', cmil: 250000, maxAmps30C: 215 },
      { awg: '300', cmil: 300000, maxAmps30C: 240 },
      { awg: '350', cmil: 350000, maxAmps30C: 260 },
      { awg: '500', cmil: 500000, maxAmps30C: 320 }
    ];

    // Find smallest gauge that meets cmil requirement
    let recommended = null;
    for (let i = 0; i < gaugeTable.length; i++) {
      if (gaugeTable[i].cmil >= requiredCmil) {
        recommended = gaugeTable[i];
        break;
      }
    }

    if (!recommended) {
      recommended = gaugeTable[gaugeTable.length - 1];
    }

    // Actual voltage drop with recommended wire
    const actualDrop = (2 * distance * resistivity * amps) / recommended.cmil;
    const dropPercent = (actualDrop / voltage) * 100;

    TradeTools.setResult('res-highlight', 'AWG ' + recommended.awg + ' ' + material);
    TradeTools.setResult('res-amperage', amps + ' amps');
    TradeTools.setResult('res-voltage', voltage + 'V');
    TradeTools.setResult('res-distance', TradeTools.fmt(distance) + ' ft (one-way)');
    TradeTools.setResult('res-material', material.charAt(0).toUpperCase() + material.slice(1));
    TradeTools.setResult('res-gauge', 'AWG ' + recommended.awg);
    TradeTools.setResult('res-drop-volts', TradeTools.fmt(actualDrop) + ' V');
    TradeTools.setResult('res-drop-pct', TradeTools.fmt(dropPercent) + '%');
    TradeTools.setResult('res-cmil', TradeTools.fmt(requiredCmil, 0) + ' cmil required, ' + TradeTools.fmt(recommended.cmil, 0) + ' cmil actual');

    TradeTools.showResults('results');
  });
});
