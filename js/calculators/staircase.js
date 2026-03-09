document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    TradeTools.clearErrors();
    const totalRise = TradeTools.getPositive('total-rise');
    const desiredRun = TradeTools.getPositive('desired-run');
    if (!totalRise || !desiredRun) return;

    // Total rise in inches
    const totalRiseIn = totalRise;

    // Ideal riser height: 7-7.75 inches per code
    // Start with target of 7.5" and find nearest whole number of risers
    const idealRiser = 7.5;
    let numRisers = Math.round(totalRiseIn / idealRiser);
    if (numRisers < 1) numRisers = 1;

    // Actual riser height
    const riserHeight = totalRiseIn / numRisers;

    // Treads = risers - 1 (top riser lands on upper floor)
    const numTreads = numRisers - 1;

    // Tread depth = desired run
    const treadDepth = desiredRun;

    // Total run (horizontal distance)
    const totalRun = numTreads * treadDepth;

    // Stringer length (hypotenuse)
    const stringerLength = Math.sqrt((totalRiseIn * totalRiseIn) + (totalRun * totalRun));

    // Stair angle
    const angleRad = Math.atan(totalRiseIn / totalRun);
    const angleDeg = angleRad * (180 / Math.PI);

    // Code compliance checks
    const riserOk = riserHeight >= 7 && riserHeight <= 7.75;
    const treadOk = treadDepth >= 10;
    // 2R + T rule: 2×riser + tread should be 24-25 inches
    const comfortRule = (2 * riserHeight) + treadDepth;
    const comfortOk = comfortRule >= 24 && comfortRule <= 25;

    let codeStatus = '';
    if (riserOk && treadOk) {
      codeStatus = '✅ Meets IRC building code (riser 7–7.75″, tread ≥10″)';
    } else {
      const issues = [];
      if (!riserOk) issues.push('riser ' + TradeTools.fmt(riserHeight) + '″ (code: 7–7.75″)');
      if (!treadOk) issues.push('tread ' + TradeTools.fmt(treadDepth) + '″ (code: min 10″)');
      codeStatus = '⚠️ Does not meet code: ' + issues.join(', ');
    }

    TradeTools.setResult('res-highlight', numRisers + ' risers × ' + TradeTools.fmt(riserHeight) + '″ each');
    TradeTools.setResult('res-total-rise', TradeTools.fmt(totalRiseIn) + ' inches');
    TradeTools.setResult('res-risers', numRisers + ' risers');
    TradeTools.setResult('res-riser-height', TradeTools.fmt(riserHeight) + ' inches');
    TradeTools.setResult('res-treads', numTreads + ' treads');
    TradeTools.setResult('res-tread-depth', TradeTools.fmt(treadDepth) + ' inches');
    TradeTools.setResult('res-total-run', TradeTools.fmt(totalRun) + ' inches (' + TradeTools.fmt(totalRun / 12) + ' ft)');
    TradeTools.setResult('res-stringer', TradeTools.fmt(stringerLength) + ' inches (' + TradeTools.fmt(stringerLength / 12) + ' ft)');
    TradeTools.setResult('res-angle', TradeTools.fmt(angleDeg) + '°');
    TradeTools.setResult('res-comfort', TradeTools.fmt(comfortRule) + '″ (ideal: 24–25″)');
    TradeTools.setResult('res-code', codeStatus);

    TradeTools.showResults('results');
  });
});
