document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const areaLength = TradeTools.getPositive('area-length');
    const areaWidth = TradeTools.getPositive('area-width');
    const tileSize = TradeTools.getPositive('tile-size');
    const groutWidth = TradeTools.getNum('grout-width');
    const wastePct = TradeTools.getNum('waste-pct');
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
    TradeTools.setResult('res-area', TradeTools.fmt(totalAreaSqFt) + ' sq ft');
    TradeTools.setResult('res-tile-size', tileSize + '" × ' + tileSize + '" (+ ' + groutWidth + '" grout)');
    TradeTools.setResult('res-tiles-no-waste', tilesNeeded + ' tiles');
    TradeTools.setResult('res-waste', wastePct + '% (' + (totalTiles - tilesNeeded) + ' extra tiles)');
    TradeTools.setResult('res-total-tiles', totalTiles + ' tiles');
    TradeTools.setResult('res-tile-sqft', TradeTools.fmt(totalTileSqFt) + ' sq ft of tile');
    TradeTools.setResult('res-highlight', totalTiles + ' tiles needed');

    TradeTools.showResults('results');
  });
});
