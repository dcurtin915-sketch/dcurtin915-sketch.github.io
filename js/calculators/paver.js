document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const patioLength = BuildCalc.getPositive('patio-length');
    const patioWidth = BuildCalc.getPositive('patio-width');
    if (!patioLength || !patioWidth) return;

    const paverSize = document.getElementById('paver-size').value;
    const jointWidth = parseFloat(document.getElementById('joint-width').value);
    const wasteFactor = parseFloat(document.getElementById('waste-factor').value) / 100;

    // Parse paver dimensions (inches)
    const [paverW, paverL] = paverSize.split('x').map(Number);

    // Patio area in sq ft
    const patioArea = patioLength * patioWidth;

    // Paver area including joint (in sq inches)
    const paverAreaIn = (paverW + jointWidth) * (paverL + jointWidth);
    const paverAreaFt = paverAreaIn / 144;

    // Pavers needed
    const paversExact = Math.ceil(patioArea / paverAreaFt);
    const paversWithWaste = Math.ceil(paversExact * (1 + wasteFactor));

    // Perimeter for edge restraint
    const perimeter = 2 * (patioLength + patioWidth);

    // Sand base: 1 inch thick typically
    // 1 inch over area = area/12 cubic feet
    // Sand weighs ~100 lbs per cu ft, 2000 lbs per ton
    const sandCuFt = patioArea / 12; // 1 inch base
    const sandTons = (sandCuFt * 100) / 2000;

    // Polymeric sand for joints: ~1 bag (50lb) per 25-75 sq ft depending on joint width
    const polyBags = Math.ceil(patioArea / (jointWidth <= 0.125 ? 75 : jointWidth <= 0.25 ? 50 : 25));

    // Gravel sub-base: 4 inches thick
    const gravelCuFt = (patioArea * 4) / 12;
    // Gravel weighs ~100-110 lbs per cu ft compacted
    const gravelTons = (gravelCuFt * 105) / 2000;

    BuildCalc.setResult('res-highlight', paversWithWaste + ' pavers needed');
    BuildCalc.setResult('res-area', BuildCalc.fmt(patioArea) + ' sq ft');
    BuildCalc.setResult('res-paver-size', paverW + '″ × ' + paverL + '″');
    BuildCalc.setResult('res-pavers-exact', paversExact + ' pavers (exact)');
    BuildCalc.setResult('res-pavers-waste', paversWithWaste + ' pavers (with ' + (wasteFactor * 100) + '% waste)');
    BuildCalc.setResult('res-sand', BuildCalc.fmt(sandTons) + ' tons leveling sand (1″ base)');
    BuildCalc.setResult('res-poly-sand', polyBags + ' bags polymeric joint sand (50 lb)');
    BuildCalc.setResult('res-gravel', BuildCalc.fmt(gravelTons) + ' tons gravel sub-base (4″ depth)');
    BuildCalc.setResult('res-edge', BuildCalc.fmt(perimeter) + ' linear ft edge restraint');

    BuildCalc.showResults('results');
  });
});
