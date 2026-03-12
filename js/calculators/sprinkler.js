document.addEventListener('DOMContentLoaded', () => {
  // Head specs: [coverage sq ft, GPM per head, radius ft]
  const headSpecs = {
    rotor: { coverage: 1200, gpm: 3, radius: 30, label: 'Rotor' },
    spray: { coverage: 200, gpm: 1.5, radius: 12, label: 'Spray' },
    drip: { coverage: 1, gpm: 0.03, radius: 1, label: 'Drip Emitter' } // ~2 GPH = 0.03 GPM
  };

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const lawnArea = BuildCalc.getPositive('lawn-area');
    const flowRate = BuildCalc.getPositive('flow-rate');
    const pressure = BuildCalc.getPositive('water-pressure');
    if (!lawnArea || !flowRate || !pressure) return;

    const headType = document.getElementById('head-type').value;
    const pipeRun = BuildCalc.getNum('pipe-run') || 100;
    const spacingMethod = document.getElementById('head-spacing').value;

    const spec = headSpecs[headType];

    // Adjust coverage for triangular spacing (15% more efficient)
    let effectiveCoverage = spec.coverage;
    if (spacingMethod === 'triangular' && headType !== 'drip') {
      effectiveCoverage = spec.coverage * 1.15;
    }

    // Number of heads
    const totalHeads = Math.ceil(lawnArea / effectiveCoverage);

    // Heads per zone based on available GPM
    const headsPerZone = Math.max(1, Math.floor(flowRate / spec.gpm));

    // Number of zones
    const zones = Math.ceil(totalHeads / headsPerZone);

    // Zone valves (one per zone)
    const valves = zones;

    // Main line pipe: from meter/valve box to furthest zone
    // Use 1" PVC for residential main line
    const mainPipe = Math.ceil(pipeRun * 1.1); // 10% extra for fittings

    // Lateral pipe: rough estimate — heads × avg spacing between heads
    let avgHeadSpacing = headType === 'drip' ? 1 : spec.radius * 2;
    const lateralPipe = Math.ceil(totalHeads * avgHeadSpacing * 0.75); // 0.75 factor for layout efficiency

    // Pipe size recommendation based on GPM
    let mainPipeSize, lateralPipeSize;
    if (flowRate > 15) {
      mainPipeSize = '1¼"';
    } else if (flowRate > 8) {
      mainPipeSize = '1"';
    } else {
      mainPipeSize = '¾"';
    }
    lateralPipeSize = headType === 'drip' ? '½" drip tubing' : '¾" PVC';

    BuildCalc.setResult('res-highlight', totalHeads + ' ' + spec.label.toLowerCase() + ' heads in ' + zones + ' zones');
    BuildCalc.setResult('res-heads', totalHeads + ' ' + spec.label.toLowerCase() + ' heads');
    BuildCalc.setResult('res-coverage', BuildCalc.fmt(effectiveCoverage) + ' sq ft per head (' + spec.radius + '\' radius)');
    BuildCalc.setResult('res-gpm-head', spec.gpm + ' GPM per head');
    BuildCalc.setResult('res-heads-zone', headsPerZone + ' heads per zone (limited by ' + flowRate + ' GPM supply)');
    BuildCalc.setResult('res-zones', zones + ' zones');
    BuildCalc.setResult('res-valves', valves + ' zone valves + 1 controller (' + valves + '-station)');
    BuildCalc.setResult('res-main-pipe', mainPipe + ' ft of ' + mainPipeSize + ' PVC (main line)');
    BuildCalc.setResult('res-lateral-pipe', '~' + lateralPipe + ' ft of ' + lateralPipeSize + ' (lateral lines)');

    BuildCalc.showResults('results');
  });
});
