document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const thickness = TradeTools.getPositive('thickness');
    const width = TradeTools.getPositive('width');
    const length = TradeTools.getPositive('length');
    const qty = TradeTools.getPositive('quantity');
    if (!thickness || !width || !length || !qty) return;

    const bfPerPiece = (thickness * width * length) / 12;
    const totalBf = bfPerPiece * qty;
    const pricePerBf = TradeTools.getNum('price-bf');
    const totalCost = (pricePerBf && pricePerBf > 0) ? totalBf * pricePerBf : null;

    TradeTools.setResult('res-bf-each', TradeTools.fmt(bfPerPiece) + ' BF');
    TradeTools.setResult('res-bf-total', TradeTools.fmt(totalBf) + ' BF');
    TradeTools.setResult('res-qty', qty + ' pieces');
    TradeTools.setResult('res-dims', `${thickness}" × ${width}" × ${length}'`);
    TradeTools.setResult('res-highlight', TradeTools.fmt(totalBf) + ' board feet');

    if (totalCost !== null) {
      TradeTools.setResult('res-cost', TradeTools.fmtCurrency(totalCost));
      document.getElementById('cost-row').style.display = 'flex';
    } else {
      document.getElementById('cost-row').style.display = 'none';
    }

    TradeTools.showResults('results');
  });
});
