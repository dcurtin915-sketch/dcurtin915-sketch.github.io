document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const areaLength = BuildCalc.getPositive('area-length');
    const areaWidth = BuildCalc.getPositive('area-width');
    const tileSize = BuildCalc.getPositive('tile-size');
    const groutWidth = BuildCalc.getNum('grout-width');
    const wastePct = BuildCalc.getNum('waste-pct');
    if (!areaLength || !areaWidth || !tileSize || groutWidth === null || wastePct === null) return;

    // Convert area to inches
    const areaLengthIn = areaLength * 12;
    const areaWidthIn = areaWidth * 12;
    const totalAreaSqFt = areaLength * areaWidth;

    // Effective tile size including grout
    const effectiveTileSize = tileSize + groutWidth;

    // Tiles along each dimension
    const tilesAlong = Math.ceil(areaLengthIn / effectiveTileSize);
    const tilesAcross = Math.ceil(areaWidthIn / effectiveTileSize);
    const tilesNeeded = tilesAlong * tilesAcross;

    // Add waste
    const wasteMultiplier = 1 + wastePct / 100;
    const totalTiles = Math.ceil(tilesNeeded * wasteMultiplier);

    // Tile coverage per tile in sq ft
    const tileSqFt = (tileSize * tileSize) / 144;
    const totalTileSqFt = totalTiles * tileSqFt;

    // Boxes (common: varies, show per-tile and per-sqft)
    BuildCalc.setResult('res-area', BuildCalc.fmt(totalAreaSqFt) + ' sq ft');
    BuildCalc.setResult('res-tile-size', tileSize + '" × ' + tileSize + '" (+ ' + groutWidth + '" grout)');
    BuildCalc.setResult('res-tiles-no-waste', tilesNeeded + ' tiles');
    BuildCalc.setResult('res-waste', wastePct + '% (' + (totalTiles - tilesNeeded) + ' extra tiles)');
    BuildCalc.setResult('res-total-tiles', totalTiles + ' tiles');
    BuildCalc.setResult('res-tile-sqft', BuildCalc.fmt(totalTileSqFt) + ' sq ft of tile');
    BuildCalc.setResult('res-highlight', totalTiles + ' tiles needed');

    BuildCalc.showResults('results');
  });
});
