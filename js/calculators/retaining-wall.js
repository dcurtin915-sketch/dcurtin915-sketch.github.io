document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const wallLength = BuildCalc.getPositive('wallLength');
    const wallHeight = BuildCalc.getPositive('wallHeight');
    const blockLength = BuildCalc.getPositive('blockLength');
    const blockHeight = BuildCalc.getPositive('blockHeight');
    const waste = BuildCalc.getNum('waste');
    if (!wallLength || !wallHeight || !blockLength || !blockHeight || waste === null) return;

    const pricePerBlock = parseFloat(document.getElementById('pricePerBlock').value) || 0;
    const wastePct = waste / 100;

    // Wall calculations
    const wallLengthIn = wallLength * 12;
    const wallHeightIn = wallHeight * 12;
    const rows = Math.ceil(wallHeightIn / blockHeight);
    const blocksPerRow = Math.ceil(wallLengthIn / blockLength);
    const wallBlocks = Math.ceil(rows * blocksPerRow * (1 + wastePct));
    const capBlocks = blocksPerRow;

    // Base gravel: 2 ft wide × 6 in deep × wall length
    const gravelCuFt = wallLength * 2 * 0.5; // 6 in = 0.5 ft
    const gravelCuYd = gravelCuFt / 27;
    const gravelTons = gravelCuYd * 1.4;

    // Drainage backfill: 1 ft wide × wall height × wall length
    const backfillCuFt = wallLength * 1 * wallHeight;
    const backfillCuYd = backfillCuFt / 27;

    const wallArea = wallLength * wallHeight;
    const totalBlocks = wallBlocks + capBlocks;
    const cost = totalBlocks * pricePerBlock;

    BuildCalc.setResult('res-area', BuildCalc.fmt(wallArea) + ' sq ft');
    BuildCalc.setResult('res-rows', rows + ' courses');
    BuildCalc.setResult('res-perrow', blocksPerRow + ' blocks');
    BuildCalc.setResult('res-blocks', BuildCalc.fmt(wallBlocks, 0) + ' blocks');
    BuildCalc.setResult('res-caps', BuildCalc.fmt(capBlocks, 0) + ' cap blocks');
    BuildCalc.setResult('res-gravel', BuildCalc.fmt(gravelTons) + ' tons (' + BuildCalc.fmt(gravelCuYd) + ' cu yd)');
    BuildCalc.setResult('res-backfill', BuildCalc.fmt(backfillCuYd) + ' cu yd');
    BuildCalc.setResult('res-cost', pricePerBlock > 0 ? BuildCalc.fmtCurrency(cost) : '—');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalBlocks, 0) + ' total blocks (incl. caps)');

    BuildCalc.showResults('results');
  });
});
