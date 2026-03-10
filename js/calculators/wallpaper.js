document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const wallHeight = BuildCalc.getPositive('wallHeight');
    const rollWidth = BuildCalc.getPositive('rollWidth');
    const rollLength = BuildCalc.getPositive('rollLength');
    if (!wallHeight || !rollWidth || !rollLength) return;

    let perimeter = BuildCalc.getNum('perimeter');
    const roomLength = BuildCalc.getNum('roomLength');
    const roomWidth = BuildCalc.getNum('roomWidth');

    // Calculate perimeter from L×W if not directly entered
    if ((!perimeter || perimeter <= 0) && roomLength > 0 && roomWidth > 0) {
      perimeter = 2 * (roomLength + roomWidth);
    }
    if (!perimeter || perimeter <= 0) {
      document.getElementById('perimeter').classList.add('input-error');
      return;
    }

    const patternRepeat = BuildCalc.getNum('patternRepeat') || 0;
    const deductions = BuildCalc.getNum('deductions') || 0;

    // Gross wall area
    const grossArea = perimeter * wallHeight;
    const netArea = Math.max(grossArea - deductions, 0);

    // Usable drop length (wall height + pattern repeat waste)
    // Pattern repeat waste: on average you lose half a repeat per drop
    const patternRepeatFt = patternRepeat / 12;
    const dropLength = patternRepeatFt > 0
      ? wallHeight + patternRepeatFt  // worst-case: full repeat waste per drop
      : wallHeight;

    // How many full drops fit in one roll?
    const dropsPerRoll = Math.floor(rollLength / dropLength);
    if (dropsPerRoll <= 0) {
      BuildCalc.setResult('res-highlight', 'Roll too short for wall height!');
      BuildCalc.showResults('results');
      return;
    }

    // Usable coverage per roll
    const rollWidthFt = rollWidth / 12;
    const usablePerRoll = dropsPerRoll * rollWidthFt * wallHeight;

    // Rolls needed
    const rolls = Math.ceil(netArea / usablePerRoll);

    // Most wallpaper is sold in double rolls; show singles
    BuildCalc.setResult('res-perimeter', BuildCalc.fmt(perimeter) + ' feet');
    BuildCalc.setResult('res-gross', BuildCalc.fmt(grossArea) + ' sq ft');
    BuildCalc.setResult('res-deductions', BuildCalc.fmt(deductions) + ' sq ft');
    BuildCalc.setResult('res-net', BuildCalc.fmt(netArea) + ' sq ft');
    BuildCalc.setResult('res-usable', BuildCalc.fmt(usablePerRoll) + ' sq ft (' + dropsPerRoll + ' drops/roll)');
    BuildCalc.setResult('res-rolls', rolls + ' single rolls');
    BuildCalc.setResult('res-buy', rolls % 2 === 0 ? (rolls / 2) + ' double rolls' : rolls + ' single rolls (or ' + Math.ceil(rolls / 2) + ' double rolls)');
    BuildCalc.setResult('res-highlight', rolls + ' rolls of wallpaper');

    BuildCalc.showResults('results');
  });
});
