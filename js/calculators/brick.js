document.addEventListener('DOMContentLoaded', () => {
  // Brick dimensions in inches: [length, height, width]
  const brickSizes = {
    standard: [8, 2.25, 3.625],
    modular: [7.625, 2.25, 3.625],
    queen: [7.625, 2.75, 3.125],
    king: [9.625, 2.625, 3.625]
  };

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('area-length');
    const height = BuildCalc.getPositive('area-height');
    if (!length || !height) return;

    const projectType = document.getElementById('project-type').value;
    const brickType = document.getElementById('brick-size').value;
    const mortarJoint = parseFloat(document.getElementById('mortar-joint').value) || 0.375;
    const wastePct = parseFloat(document.getElementById('waste-pct').value) || 0;
    const costPerBrick = BuildCalc.getNum('cost-per-brick');

    const brick = brickSizes[brickType];
    const brickLen = brick[0];
    const brickHeight = brick[1];
    const brickWidth = brick[2];

    const areaSqFt = length * height;

    let bricksPerSqFt;
    if (projectType === 'wall') {
      // Wall: face exposed = length × height of brick
      bricksPerSqFt = 144 / ((brickLen + mortarJoint) * (brickHeight + mortarJoint));
    } else {
      // Patio: flat = length × width of brick
      bricksPerSqFt = 144 / ((brickLen + mortarJoint) * (brickWidth + mortarJoint));
    }

    const bricksNet = Math.ceil(areaSqFt * bricksPerSqFt);
    const bricksTotal = Math.ceil(bricksNet * (1 + wastePct / 100));

    // Mortar: ~7 bags (70 lb) per 1,000 bricks for walls; patios often use sand instead
    let mortarBags = 0;
    if (projectType === 'wall') {
      mortarBags = Math.ceil(bricksTotal / 1000 * 7);
    }

    const totalCost = costPerBrick !== null && costPerBrick > 0 ? bricksTotal * costPerBrick : null;

    BuildCalc.setResult('res-highlight', bricksTotal.toLocaleString() + ' bricks needed');
    BuildCalc.setResult('res-area', BuildCalc.fmt(areaSqFt) + ' sq ft');
    BuildCalc.setResult('res-per-sqft', BuildCalc.fmt(bricksPerSqFt) + ' bricks per sq ft');
    BuildCalc.setResult('res-bricks-net', bricksNet.toLocaleString() + ' bricks');
    BuildCalc.setResult('res-bricks-total', bricksTotal.toLocaleString() + ' bricks (includes ' + wastePct + '% waste)');

    if (projectType === 'wall') {
      BuildCalc.setResult('res-mortar', mortarBags + ' bags (Type S, 70 lb)');
    } else {
      BuildCalc.setResult('res-mortar', 'N/A — use polymeric sand for patio joints');
    }

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost) + ' @ ' + BuildCalc.fmtCurrency(costPerBrick) + '/brick');
    } else {
      BuildCalc.setResult('res-cost', '—');
    }

    BuildCalc.showResults('results');
  });
});
