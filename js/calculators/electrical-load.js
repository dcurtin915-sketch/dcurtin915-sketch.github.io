document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const sqft = BuildCalc.getPositive('sqft');
    if (!sqft) return;

    const voltage = parseFloat(document.getElementById('voltage').value);
    const rangeW = BuildCalc.getNum('range') || 0;
    const dryerW = BuildCalc.getNum('dryer') || 0;
    const waterHeaterW = BuildCalc.getNum('waterHeater') || 0;
    const acW = BuildCalc.getNum('ac') || 0;
    const dishwasherW = BuildCalc.getNum('dishwasher') || 0;
    const otherW = BuildCalc.getNum('otherAppliances') || 0;
    const smallAppCircuits = BuildCalc.getNum('smallAppCircuits') || 0;
    const laundryCircuits = BuildCalc.getNum('laundryCircuits') || 0;

    // NEC Article 220 Standard Calculation
    // General lighting: 3 VA per sq ft
    const lightingLoad = sqft * 3;

    // Small appliance circuits: 1500 VA each (NEC minimum 2)
    const smallAppLoad = smallAppCircuits * 1500;

    // Laundry circuits: 1500 VA each (NEC minimum 1)
    const laundryLoad = laundryCircuits * 1500;

    // General load before demand factors
    const generalTotal = lightingLoad + smallAppLoad + laundryLoad;

    // Demand factor: first 3000 VA at 100%, remainder at 35%
    let generalDemand;
    if (generalTotal <= 3000) {
      generalDemand = generalTotal;
    } else {
      generalDemand = 3000 + (generalTotal - 3000) * 0.35;
    }

    // Range demand per NEC Table 220.55 (single range ≤12kW = 8kW demand)
    let rangeDemand = 0;
    if (rangeW > 0) {
      rangeDemand = rangeW <= 12000 ? 8000 : rangeW;
    }

    // Other major appliances at 100%
    const majorAppliances = dryerW + waterHeaterW + dishwasherW + otherW;

    // AC at 100% (NEC: use larger of heating or cooling, not both — simplified here)
    const acLoad = acW;

    const totalDemand = Math.round(generalDemand + rangeDemand + majorAppliances + acLoad);
    const totalAmps = totalDemand / voltage;

    // Recommend service size
    let serviceSize;
    if (totalAmps <= 100) serviceSize = '100A';
    else if (totalAmps <= 150) serviceSize = '150A';
    else if (totalAmps <= 200) serviceSize = '200A';
    else if (totalAmps <= 320) serviceSize = '320A';
    else serviceSize = '400A';

    BuildCalc.setResult('res-lighting', BuildCalc.fmt(lightingLoad, 0) + ' VA (' + BuildCalc.fmt(sqft, 0) + ' sq ft × 3 VA)');
    BuildCalc.setResult('res-smallapp', BuildCalc.fmt(smallAppLoad, 0) + ' VA (' + smallAppCircuits + ' circuits × 1,500 VA)');
    BuildCalc.setResult('res-laundry', BuildCalc.fmt(laundryLoad, 0) + ' VA (' + laundryCircuits + ' circuit' + (laundryCircuits !== 1 ? 's' : '') + ' × 1,500 VA)');
    BuildCalc.setResult('res-general', BuildCalc.fmt(generalDemand, 0) + ' VA (after 35% demand factor)');
    BuildCalc.setResult('res-range', rangeDemand > 0 ? BuildCalc.fmt(rangeDemand, 0) + ' VA (NEC Table 220.55)' : 'None');
    BuildCalc.setResult('res-appliances', BuildCalc.fmt(majorAppliances, 0) + ' VA (dryer + water heater + dishwasher + other)');
    BuildCalc.setResult('res-ac', BuildCalc.fmt(acLoad, 0) + ' VA');
    BuildCalc.setResult('res-total', BuildCalc.fmt(totalDemand, 0) + ' watts');
    BuildCalc.setResult('res-amps', BuildCalc.fmt(totalAmps) + ' amps @ ' + voltage + 'V');
    BuildCalc.setResult('res-service', serviceSize + ' panel');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalAmps, 0) + ' amps — ' + serviceSize + ' service recommended');

    BuildCalc.showResults('results');
  });
});
