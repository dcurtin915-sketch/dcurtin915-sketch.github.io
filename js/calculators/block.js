document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const wallLength = BuildCalc.getPositive('wall-length');
    const wallHeight = BuildCalc.getPositive('wall-height');
    if (!wallLength || !wallHeight) return;

    const blockSize = document.getElementById('block-size').value;
    const mortarJoint = parseFloat(document.getElementById('mortar-joint').value);

    // Block dimensions (inches)
    let blockH, blockW;
    if (blockSize === '8x8x16') {
      blockH = 8; blockW = 16;
    } else if (blockSize === '8x4x16') {
      blockH = 4; blockW = 16;
    } else {
      blockH = 8; blockW = 12;
    }

    // Wall area in sq ft
    const wallArea = wallLength * wallHeight;

    // Effective block face area (block + mortar joint on one side and top)
    const effectiveH = (blockH + mortarJoint) / 12; // in feet
    const effectiveW = (blockW + mortarJoint) / 12; // in feet
    const blocksPerSqFt = 1 / (effectiveH * effectiveW);
    const blocksNeeded = Math.ceil(wallArea * blocksPerSqFt);

    // Add 5% waste
    const blocksWithWaste = Math.ceil(blocksNeeded * 1.05);

    // Mortar: approximately 3.5 bags (70lb) per 100 blocks for 3/8" joint
    const mortarBags = Math.ceil((blocksWithWaste / 100) * 3.5);

    // Rebar: vertical every 4ft, horizontal every 4ft of height
    const verticalRebar = Math.ceil(wallLength / 4) + 1;
    const horizontalRebar = Math.ceil(wallHeight / 4);
    const totalRebar = verticalRebar + horizontalRebar;

    // Courses (rows of blocks)
    const courses = Math.ceil(wallHeight / effectiveH);

    BuildCalc.setResult('res-highlight', blocksWithWaste + ' blocks needed');
    BuildCalc.setResult('res-wall-area', BuildCalc.fmt(wallArea) + ' sq ft');
    BuildCalc.setResult('res-block-size', blockSize.replace(/x/g, '×') + ' (nominal)');
    BuildCalc.setResult('res-courses', courses + ' courses');
    BuildCalc.setResult('res-blocks-exact', blocksNeeded + ' blocks (exact)');
    BuildCalc.setResult('res-blocks-waste', blocksWithWaste + ' blocks (with 5% waste)');
    BuildCalc.setResult('res-mortar', mortarBags + ' bags (70 lb mortar mix)');
    BuildCalc.setResult('res-rebar', totalRebar + ' rebar pieces (' + verticalRebar + ' vertical + ' + horizontalRebar + ' horizontal)');

    BuildCalc.showResults('results');
  });
});
