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
    TradeTools.clearErrors();
    const fenceType = typeSelect.value;
    const totalLength = TradeTools.getPositive('fence-length');
    const fenceHeight = TradeTools.getPositive('fence-height');
    const postSpacing = parseFloat(document.getElementById('post-spacing').value);
    const gates = TradeTools.getInt('gate-count');
    if (!totalLength || !fenceHeight || gates === null) return;

    // Posts: one at each end + one every postSpacing interval
    const sections = Math.ceil(totalLength / postSpacing);
    const posts = sections + 1 + gates; // extra post per gate

    // Concrete for post holes: ~1 bag (50lb) per post hole for standard, 1.5 for tall fences
    const bagsPerPost = fenceHeight > 6 ? 2 : 1;
    const concreteBags = posts * bagsPerPost;

    if (fenceType === 'wood') {
      const picketWidth = TradeTools.getPositive('picket-width');
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

      TradeTools.setResult('res-highlight', posts + ' posts, ' + pickets + ' pickets');
      TradeTools.setResult('res-type', 'Wood Fence');
      TradeTools.setResult('res-length', TradeTools.fmt(totalLength) + ' ft total');
      TradeTools.setResult('res-height', TradeTools.fmt(fenceHeight) + ' ft');
      TradeTools.setResult('res-posts', posts + ' posts (4×4)');
      TradeTools.setResult('res-rails', totalRails + ' rails (2×4) — ' + railsPerSection + ' per section');
      TradeTools.setResult('res-pickets', pickets + ' pickets (' + TradeTools.fmt(picketWidth) + '" wide)');
      TradeTools.setResult('res-concrete', concreteBags + ' bags (50 lb fast-set)');
      TradeTools.setResult('res-gates', gates + ' gate(s), ' + gateHardwareSets + ' hardware set(s)');
    } else {
      // Chain link
      const fabricHeight = fenceHeight; // chain link fabric sold by height
      const fabricFeet = Math.ceil(totalLength); // linear feet of fabric
      const topRail = Math.ceil(totalLength / 10.5); // top rail comes in 10.5ft sections
      const tiesPerFoot = 1; // roughly 1 tie per foot
      const ties = fabricFeet * tiesPerFoot;
      const tensionBands = posts * 3; // ~3 per terminal post (simplified)

      TradeTools.setResult('res-highlight', posts + ' posts, ' + fabricFeet + ' ft fabric');
      TradeTools.setResult('res-type', 'Chain Link Fence');
      TradeTools.setResult('res-length', TradeTools.fmt(totalLength) + ' ft total');
      TradeTools.setResult('res-height', TradeTools.fmt(fenceHeight) + ' ft');
      TradeTools.setResult('res-posts', posts + ' posts (terminal + line)');
      TradeTools.setResult('res-rails', topRail + ' top rail sections (10.5 ft each)');
      TradeTools.setResult('res-pickets', fabricFeet + ' linear ft of chain link fabric');
      TradeTools.setResult('res-concrete', concreteBags + ' bags (50 lb fast-set)');
      TradeTools.setResult('res-gates', gates + ' gate(s)');
    }

    TradeTools.showResults('results');
  });
});
