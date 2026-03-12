document.addEventListener('DOMContentLoaded', () => {
  const holeDiamSelect = document.getElementById('hole-diameter');
  const holeDepthSelect = document.getElementById('hole-depth');
  const customDiamField = document.getElementById('custom-diam-field');
  const customDepthField = document.getElementById('custom-depth-field');

  holeDiamSelect.addEventListener('change', () => {
    customDiamField.style.display = holeDiamSelect.value === 'custom' ? 'block' : 'none';
  });
  holeDepthSelect.addEventListener('change', () => {
    customDepthField.style.display = holeDepthSelect.value === 'custom_depth' ? 'block' : 'none';
  });

  // Bag yields in cubic feet
  const bagYields = { '40': 0.30, '50': 0.375, '60': 0.45, '80': 0.60 };

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    let holeDiam;
    if (holeDiamSelect.value === 'custom') {
      holeDiam = BuildCalc.getPositive('custom-diameter');
      if (!holeDiam) return;
    } else {
      holeDiam = parseFloat(holeDiamSelect.value);
    }

    let holeDepth;
    if (holeDepthSelect.value === 'custom_depth') {
      holeDepth = BuildCalc.getPositive('custom-depth');
      if (!holeDepth) return;
    } else {
      holeDepth = parseFloat(holeDepthSelect.value);
    }

    const postSize = parseFloat(document.getElementById('post-size').value);
    const numPosts = parseInt(document.getElementById('num-posts').value) || 1;
    const bagSize = document.getElementById('bag-size').value;
    const bagYield = bagYields[bagSize];

    // Hole volume (cylinder) in cubic inches
    const holeRadius = holeDiam / 2;
    const holeVolCuIn = Math.PI * Math.pow(holeRadius, 2) * holeDepth;

    // Post displacement in cubic inches
    // Square posts: side × side × depth; round posts: π × r² × depth
    let postVolCuIn = 0;
    if (postSize === 2.375) {
      // Round metal post
      postVolCuIn = Math.PI * Math.pow(postSize / 2, 2) * holeDepth;
    } else if (postSize > 0) {
      // Square wood post
      postVolCuIn = postSize * postSize * holeDepth;
    }

    // Concrete volume per hole in cubic feet
    const concretePerHoleCuIn = holeVolCuIn - postVolCuIn;
    const concretePerHoleCuFt = concretePerHoleCuIn / 1728;

    // Bags per post (round up)
    const bagsPerPost = Math.ceil(concretePerHoleCuFt / bagYield);

    // Totals
    const totalBags = bagsPerPost * numPosts;
    const totalVolCuFt = concretePerHoleCuFt * numPosts;
    const totalVolCuYd = totalVolCuFt / 27;

    BuildCalc.setResult('res-highlight', totalBags + ' bags (' + bagSize + ' lb) total');
    BuildCalc.setResult('res-hole-vol', BuildCalc.fmt(holeVolCuIn / 1728) + ' cu ft (' + holeDiam + '" × ' + holeDepth + '" deep)');
    BuildCalc.setResult('res-post-vol', BuildCalc.fmt(postVolCuIn / 1728) + ' cu ft displaced');
    BuildCalc.setResult('res-per-hole', BuildCalc.fmt(concretePerHoleCuFt) + ' cu ft per hole');
    BuildCalc.setResult('res-bags-each', bagsPerPost + ' bags per post');
    BuildCalc.setResult('res-posts', numPosts + ' posts');
    BuildCalc.setResult('res-total-bags', totalBags + ' bags (' + bagSize + ' lb each)');
    BuildCalc.setResult('res-total-vol', BuildCalc.fmt(totalVolCuFt) + ' cu ft (' + BuildCalc.fmt(totalVolCuYd) + ' cu yd)');

    BuildCalc.showResults('results');
  });
});
