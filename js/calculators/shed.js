document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('shed-length');
    const width = BuildCalc.getPositive('shed-width');
    const wallHeight = BuildCalc.getPositive('wall-height');
    if (!length || !width || !wallHeight) return;

    const pitchFactor = parseFloat(document.getElementById('roof-pitch').value);
    const studSpacing = parseFloat(document.getElementById('stud-spacing').value);
    const numDoors = BuildCalc.getNum('num-doors') || 0;
    const waste = 1.10; // 10% waste

    // FRAMING
    const perimeter = 2 * (length + width);

    // Wall studs: each wall gets (wall_length / spacing) + 1, plus corners
    // 4 walls, deduct door openings (each door ~3ft removes ~2 studs but adds 2 jack+king)
    const longWallStuds = Math.ceil((length * 12) / studSpacing) + 1;
    const shortWallStuds = Math.ceil((width * 12) / studSpacing) + 1;
    const rawStuds = (longWallStuds * 2) + (shortWallStuds * 2);
    const totalStuds = Math.ceil(rawStuds * waste);

    // Plates: double top plate + single bottom plate = 3× perimeter
    // Each plate is 8ft long
    const plateLF = perimeter * 3;
    const plateCount = Math.ceil((plateLF / 8) * waste);

    // Floor joists (2×6) at 16" OC spanning the width
    const floorJoists = Math.ceil((length * 12) / 16) + 1;
    const totalJoists = Math.ceil(floorJoists * waste);

    // SHEATHING (4×8 = 32 sqft per sheet)
    const wallArea = perimeter * wallHeight;
    const doorDeduct = numDoors * 3 * wallHeight; // rough door opening
    const netWallArea = wallArea - doorDeduct;
    const wallSheets = Math.ceil((netWallArea / 32) * waste);

    // Floor sheathing
    const floorArea = length * width;
    const floorSheets = Math.ceil((floorArea / 32) * waste);

    // Roof: gable roof, two sides
    // Each side: length × (half-width × pitchFactor) + 1ft overhang each side
    const rafterRun = (width / 2) * pitchFactor;
    const roofOverhang = 1; // 1ft overhang
    const roofSideArea = (length + 2 * roofOverhang) * (rafterRun + roofOverhang);
    const totalRoofArea = roofSideArea * 2;
    const roofSheets = Math.ceil((totalRoofArea / 32) * waste);

    // Shingle bundles (3 bundles = 1 square = 100 sqft)
    const shingleBundles = Math.ceil((totalRoofArea / 33.33) * waste);

    BuildCalc.setResult('res-highlight', length + '×' + width + ' ft shed — material list ready');
    BuildCalc.setResult('res-studs', totalStuds + ' studs (2×4×' + Math.ceil(wallHeight) + ')');
    BuildCalc.setResult('res-plates', plateCount + ' plates (2×4×8)');
    BuildCalc.setResult('res-joists', totalJoists + ' floor joists (2×6×' + Math.ceil(width) + ')');
    BuildCalc.setResult('res-wall-sheath', wallSheets + ' sheets');
    BuildCalc.setResult('res-roof-sheath', roofSheets + ' sheets');
    BuildCalc.setResult('res-floor-sheath', floorSheets + ' sheets');
    BuildCalc.setResult('res-roof-area', BuildCalc.fmt(totalRoofArea) + ' sq ft');
    BuildCalc.setResult('res-bundles', shingleBundles + ' bundles (3 per square)');

    BuildCalc.showResults('results');
  });
});
