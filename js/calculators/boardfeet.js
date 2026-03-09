document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const thickness = BuildCalc.getPositive('thickness');
    const width = BuildCalc.getPositive('width');
    const length = BuildCalc.getPositive('length');
    const qty = BuildCalc.getPositive('quantity');
    if (!thickness || !width || !length || !qty) return;

    const bfPerPiece = (thickness * width * length) / 12;
    const totalBf = bfPerPiece * qty;
    const pricePerBf = BuildCalc.getNum('price-bf');
    const totalCost = (pricePerBf && pricePerBf > 0) ? totalBf * pricePerBf : null;

    BuildCalc.setResult('res-bf-each', BuildCalc.fmt(bfPerPiece) + ' BF');
    BuildCalc.setResult('res-bf-total', BuildCalc.fmt(totalBf) + ' BF');
    BuildCalc.setResult('res-qty', qty + ' pieces');
    BuildCalc.setResult('res-dims', `${thickness}" × ${width}" × ${length}'`);
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalBf) + ' board feet');

    if (totalCost !== null) {
      BuildCalc.setResult('res-cost', BuildCalc.fmtCurrency(totalCost));
      document.getElementById('cost-row').style.display = 'flex';
    } else {
      document.getElementById('cost-row').style.display = 'none';
    }

    BuildCalc.showResults('results');
  });
});
