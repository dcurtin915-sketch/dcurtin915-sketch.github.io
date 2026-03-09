document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('fence-type');
  const woodFields = document.getElementById('wood-fields');
  const chainFields = document.getElementById('chain-fields');

  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'wood') {
      woodFields.style.display = 'block';
      chainFields.style.display = 'none';
    } else {
      woodFields.style.display = 'none';
      chainFields.style.display = 'block';
    }
  });

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const fenceType = typeSelect.value;
    const totalLength = BuildCalc.getPositive('fence-length');
    const fenceHeight = BuildCalc.getPositive('fence-height');
    const postSpacing = parseFloat(document.getElementById('post-spacing').value);
    const gates = BuildCalc.getInt('gate-count');
    if (!totalLength || !fenceHeight || gates === null) return;

    // Posts: one at each end + one every postSpacing interval
    const sections = Math.ceil(totalLength / postSpacing);
    const posts = sections + 1 + gates; // extra post per gate

    // Concrete for post holes: ~1 bag (50lb) per post hole for standard, 1.5 for tall fences
    const bagsPerPost = fenceHeight > 6 ? 2 : 1;
    const concreteBags = posts * bagsPerPost;

    if (fenceType === 'wood') {
      const picketWidth = BuildCalc.getPositive('picket-width');
      if (!picketWidth) return;

      // Rails: 2 rails for fences ≤6ft, 3 rails for taller
      const railsPerSection = fenceHeight > 6 ? 3 : 2;
      const totalRails = sections * railsPerSection;

      // Pickets: total length in inches / (picket width + ~0.125" gap)
      const gapInches = 0.125;
      const picketWidthIn = picketWidth;
      const totalLengthIn = totalLength * 12;
      const pickets = Math.ceil(totalLengthIn / (picketWidthIn + gapInches));

      // Gate hardware sets
      const gateHardwareSets = gates;

      BuildCalc.setResult('res-highlight', posts + ' posts, ' + pickets + ' pickets');
      BuildCalc.setResult('res-type', 'Wood Fence');
      BuildCalc.setResult('res-length', BuildCalc.fmt(totalLength) + ' ft total');
      BuildCalc.setResult('res-height', BuildCalc.fmt(fenceHeight) + ' ft');
      BuildCalc.setResult('res-posts', posts + ' posts (4×4)');
      BuildCalc.setResult('res-rails', totalRails + ' rails (2×4) — ' + railsPerSection + ' per section');
      BuildCalc.setResult('res-pickets', pickets + ' pickets (' + BuildCalc.fmt(picketWidth) + '" wide)');
      BuildCalc.setResult('res-concrete', concreteBags + ' bags (50 lb fast-set)');
      BuildCalc.setResult('res-gates', gates + ' gate(s), ' + gateHardwareSets + ' hardware set(s)');
    } else {
      // Chain link
      const fabricHeight = fenceHeight; // chain link fabric sold by height
      const fabricFeet = Math.ceil(totalLength); // linear feet of fabric
      const topRail = Math.ceil(totalLength / 10.5); // top rail comes in 10.5ft sections
      const tiesPerFoot = 1; // roughly 1 tie per foot
      const ties = fabricFeet * tiesPerFoot;
      const tensionBands = posts * 3; // ~3 per terminal post (simplified)

      BuildCalc.setResult('res-highlight', posts + ' posts, ' + fabricFeet + ' ft fabric');
      BuildCalc.setResult('res-type', 'Chain Link Fence');
      BuildCalc.setResult('res-length', BuildCalc.fmt(totalLength) + ' ft total');
      BuildCalc.setResult('res-height', BuildCalc.fmt(fenceHeight) + ' ft');
      BuildCalc.setResult('res-posts', posts + ' posts (terminal + line)');
      BuildCalc.setResult('res-rails', topRail + ' top rail sections (10.5 ft each)');
      BuildCalc.setResult('res-pickets', fabricFeet + ' linear ft of chain link fabric');
      BuildCalc.setResult('res-concrete', concreteBags + ' bags (50 lb fast-set)');
      BuildCalc.setResult('res-gates', gates + ' gate(s)');
    }

    BuildCalc.showResults('results');
  });
});
