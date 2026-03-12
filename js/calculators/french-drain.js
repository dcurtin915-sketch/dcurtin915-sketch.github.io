document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const drainLength = BuildCalc.getPositive('drain-length');
    if (!drainLength) return;

    const trenchWidth = parseFloat(document.getElementById('trench-width').value); // inches
    const trenchDepth = parseFloat(document.getElementById('trench-depth').value); // inches
    const pipeDiam = parseFloat(document.getElementById('pipe-diameter').value); // inches
    const gravelCost = BuildCalc.getNum('gravel-cost');

    // Trench volume in cubic feet
    const trenchVolCuFt = drainLength * (trenchWidth / 12) * (trenchDepth / 12);
    const trenchVolCuYd = trenchVolCuFt / 27;

    // Gravel: fills the trench (we don't subtract pipe — ensures full capacity)
    const gravelCuYd = trenchVolCuYd;

    // Gravel weight: #57 stone ≈ 2,800 lbs (1.4 tons) per cubic yard
    const gravelTons = gravelCuYd * 1.4;

    // Perforated pipe: same length as drain + 10% for fittings/connections
    const pipeLength = Math.ceil(drainLength * 1.1);

    // Landscape fabric: lines bottom and sides with 6" overlap at top
    // Width needed = 2 × depth + trench width + 12" overlap (in inches), convert to feet
    const fabricWidthFt = (2 * trenchDepth + trenchWidth + 12) / 12;
    const fabricSqFt = fabricWidthFt * drainLength;

    // Pipe sock (filter fabric sleeve) — same length as pipe
    const sockLength = pipeLength;

    // Cost
    const totalGravelCost = gravelCost !== null && gravelCost > 0 ? gravelTons * gravelCost : null;

    BuildCalc.setResult('res-highlight', BuildCalc.fmt(gravelTons) + ' tons of gravel for ' + drainLength + '\' drain');
    BuildCalc.setResult('res-trench-vol', BuildCalc.fmt(trenchVolCuFt) + ' cu ft (' + BuildCalc.fmt(trenchVolCuYd) + ' cu yd)');
    BuildCalc.setResult('res-gravel-cuyd', BuildCalc.fmt(gravelCuYd) + ' cubic yards');
    BuildCalc.setResult('res-gravel-tons', BuildCalc.fmt(gravelTons) + ' tons (#57 drainage stone)');
    BuildCalc.setResult('res-pipe', pipeLength + ' ft of ' + pipeDiam + '" perforated pipe');
    BuildCalc.setResult('res-fabric', BuildCalc.fmt(fabricSqFt) + ' sq ft (' + BuildCalc.fmt(fabricWidthFt) + '\' wide × ' + drainLength + '\' long)');
    BuildCalc.setResult('res-sock', sockLength + ' ft of filter sock (optional if using fabric)');

    if (totalGravelCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalGravelCost) + ' @ ' + BuildCalc.fmtCurrency(gravelCost) + '/ton');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
