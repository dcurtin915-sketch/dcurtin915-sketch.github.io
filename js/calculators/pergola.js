document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const length = BuildCalc.getPositive('pergola-length');
    const width = BuildCalc.getPositive('pergola-width');
    if (!length || !width) return;

    const postHeight = parseFloat(document.getElementById('post-height').value);
    const rafterSpacing = parseFloat(document.getElementById('rafter-spacing').value);
    const purlinSpacing = parseFloat(document.getElementById('purlin-spacing').value);
    const overhang = parseFloat(document.getElementById('rafter-overhang').value) / 12; // convert to feet

    // Posts: 4 for up to 16', 6 for longer (add middle posts on long sides)
    const posts = length > 16 ? 6 : 4;

    // Beams: 2 doubled beams (4 boards total), each runs the width direction
    // Beam length = width (they sit on posts at each end)
    const beamCount = 4; // 2 doubled beams
    const beamLength = width;

    // Rafters: run the length direction, spaced across the width
    const rafterCount = Math.floor((width * 12) / rafterSpacing) + 1;
    const rafterLength = length + (2 * overhang);

    // Purlins: run the width direction, spaced along the length (on top of rafters)
    let purlinCount = 0;
    if (purlinSpacing > 0) {
      purlinCount = Math.floor((length * 12) / purlinSpacing) + 1;
    }
    const purlinLength = width + (2 * overhang);

    // Post height for lumber: post height + 3 ft buried = total post length
    const totalPostLength = postHeight + 3;

    // Hardware: 1 post base bracket per post
    const hardware = posts;

    // Concrete: ~2 bags of 80 lb per post for 12" diameter × 3' deep holes
    const concreteBags = posts * 2;

    // Board feet calculation
    // Posts: 6×6 = (5.5×5.5 actual, but nominal 6×6) → BF = 6×6×L/12 = 3L
    const postBF = posts * (6 * 6 * totalPostLength / 12);
    // Beams: 2×10 → BF = 2×10×L/12
    const beamBF = beamCount * (2 * 10 * beamLength / 12);
    // Rafters: 2×8 → BF = 2×8×L/12
    const rafterBF = rafterCount * (2 * 8 * rafterLength / 12);
    // Purlins: 2×2 → BF = 2×2×L/12
    const purlinBF = purlinCount * (2 * 2 * purlinLength / 12);
    const totalBF = postBF + beamBF + rafterBF + purlinBF;

    BuildCalc.setResult('res-highlight', posts + ' posts, ' + rafterCount + ' rafters, ' + purlinCount + ' purlins');
    BuildCalc.setResult('res-posts', posts + ' — 6×6 × ' + totalPostLength + '\' each (includes 3\' buried)');
    BuildCalc.setResult('res-beams', beamCount + ' boards — 2×10 × ' + BuildCalc.fmt(beamLength) + '\' (2 doubled beams)');
    BuildCalc.setResult('res-rafters', rafterCount + ' — 2×8 × ' + BuildCalc.fmt(rafterLength) + '\' each');
    BuildCalc.setResult('res-rafter-len', BuildCalc.fmt(rafterLength) + '\' (' + length + '\' span + ' + BuildCalc.fmt(overhang * 2) + '\' overhang)');
    BuildCalc.setResult('res-purlins', purlinCount > 0 ? purlinCount + ' — 2×2 × ' + BuildCalc.fmt(purlinLength) + '\' each' : 'None');
    BuildCalc.setResult('res-hardware', hardware + ' post base brackets + bolts');
    BuildCalc.setResult('res-concrete', concreteBags + ' bags (80 lb) — 2 per post hole');
    BuildCalc.setResult('res-bf', BuildCalc.fmt(totalBF) + ' board feet total');

    BuildCalc.showResults('results');
  });
});
