document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    let flowGPM = BuildCalc.getNum('flowRate');
    const fixtures = BuildCalc.getNum('fixtures');

    // If fixture units provided, convert to GPM using Hunter's Curve approximation
    if (fixtures && fixtures > 0) {
      // Simplified Hunter's Curve: GPM ≈ 1.0 × FU^0.5 for supply (flush-valve-free)
      // More accurate piecewise: ≤6 FU → 5 GPM, ≤20 → ~sqrt*2.5, etc.
      if (fixtures <= 6) flowGPM = 5;
      else if (fixtures <= 20) flowGPM = 2.5 * Math.sqrt(fixtures);
      else if (fixtures <= 100) flowGPM = 1.8 * Math.sqrt(fixtures) + 2;
      else flowGPM = 1.5 * Math.sqrt(fixtures) + 5;
    }

    if (!flowGPM || flowGPM <= 0) {
      document.getElementById('flowRate').classList.add('input-error');
      return;
    }

    const maxVelocity = parseFloat(document.getElementById('maxVelocity').value);
    const pipeType = document.getElementById('pipeType').value;

    // Convert GPM to cubic feet per second
    const flowCFS = flowGPM / 448.83;

    // Required cross-sectional area (sq ft)
    const areaRequired = flowCFS / maxVelocity;

    // Minimum inside diameter in inches
    const minDiaIn = Math.sqrt(4 * areaRequired / Math.PI) * 12;

    // Standard nominal pipe sizes with approximate inside diameters by material
    const pipeSizes = {
      copper: [
        { nominal: '1/2"', id: 0.545 },
        { nominal: '3/4"', id: 0.785 },
        { nominal: '1"', id: 1.025 },
        { nominal: '1-1/4"', id: 1.265 },
        { nominal: '1-1/2"', id: 1.505 },
        { nominal: '2"', id: 1.985 },
        { nominal: '2-1/2"', id: 2.465 },
        { nominal: '3"', id: 2.945 }
      ],
      pex: [
        { nominal: '1/2"', id: 0.475 },
        { nominal: '3/4"', id: 0.681 },
        { nominal: '1"', id: 0.862 },
        { nominal: '1-1/4"', id: 1.076 },
        { nominal: '1-1/2"', id: 1.278 },
        { nominal: '2"', id: 1.720 }
      ],
      cpvc: [
        { nominal: '1/2"', id: 0.536 },
        { nominal: '3/4"', id: 0.721 },
        { nominal: '1"', id: 0.930 },
        { nominal: '1-1/4"', id: 1.189 },
        { nominal: '1-1/2"', id: 1.406 },
        { nominal: '2"', id: 1.846 }
      ]
    };

    const sizes = pipeSizes[pipeType];
    let selected = sizes[sizes.length - 1]; // default to largest
    for (const s of sizes) {
      if (s.id >= minDiaIn) {
        selected = s;
        break;
      }
    }

    // Calculate actual velocity with selected pipe
    const actualAreaFt2 = Math.PI * Math.pow(selected.id / 12 / 2, 2);
    const actualVelocity = flowCFS / actualAreaFt2;

    const materialNames = { copper: 'Copper (Type L)', pex: 'PEX', cpvc: 'CPVC' };

    BuildCalc.setResult('res-flow', BuildCalc.fmt(flowGPM) + ' GPM');
    BuildCalc.setResult('res-velocity', maxVelocity + ' ft/s (max design)');
    BuildCalc.setResult('res-mindia', BuildCalc.fmt(minDiaIn, 3) + ' inches');
    BuildCalc.setResult('res-nominal', selected.nominal + ' ' + materialNames[pipeType]);
    BuildCalc.setResult('res-actualdia', BuildCalc.fmt(selected.id, 3) + ' inches');
    BuildCalc.setResult('res-actualvel', BuildCalc.fmt(actualVelocity) + ' ft/s');
    BuildCalc.setResult('res-material', materialNames[pipeType]);
    BuildCalc.setResult('res-highlight', selected.nominal + ' ' + materialNames[pipeType] + ' pipe');

    BuildCalc.showResults('results');
  });
});
