document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const roomLength = BuildCalc.getPositive('roomLength');
    const roomWidth = BuildCalc.getPositive('roomWidth');
    const ceilingHeight = BuildCalc.getPositive('ceilingHeight');
    const occupants = BuildCalc.getPositive('occupants');
    if (!roomLength || !roomWidth || !ceilingHeight || !occupants) return;

    const insulation = document.getElementById('insulation').value;
    const climate = document.getElementById('climate').value;
    const sunExposure = document.getElementById('sunExposure').value;
    const mode = document.getElementById('mode').value;

    const area = roomLength * roomWidth;
    const volume = area * ceilingHeight;

    // Base BTU: 20/sq ft cooling, 30/sq ft heating
    const btuPerSqFt = mode === 'cooling' ? 20 : 30;
    const baseBtu = area * btuPerSqFt;

    // Ceiling adjustment: +12.5% per foot above 8 ft
    const ceilingAdj = ceilingHeight > 8 ? 1 + (ceilingHeight - 8) * 0.125 : 1;

    // Insulation factor
    const insulationFactors = { 'poor': 1.3, 'average': 1.0, 'good': 0.8 };
    const insFactor = insulationFactors[insulation];

    // Climate factor
    const climateFactors = { 'hot': 1.2, 'warm': 1.1, 'moderate': 1.0, 'cold': 1.1, 'very-cold': 1.3 };
    const climFactor = climateFactors[climate];

    // Sun adjustment
    const sunFactors = { 'shaded': 0.9, 'average': 1.0, 'sunny': 1.1 };
    const sunFactor = sunFactors[sunExposure];

    // Occupant load: +600 BTU per person beyond 2
    const occupantBtu = occupants > 2 ? (occupants - 2) * 600 : 0;

    const totalBtu = Math.ceil((baseBtu * ceilingAdj * insFactor * climFactor * sunFactor + occupantBtu) / 100) * 100;
    const tons = totalBtu / 12000;

    BuildCalc.setResult('res-area', BuildCalc.fmt(area) + ' sq ft');
    BuildCalc.setResult('res-volume', BuildCalc.fmt(volume) + ' cu ft');
    BuildCalc.setResult('res-base', BuildCalc.fmt(baseBtu, 0) + ' BTU (' + btuPerSqFt + ' BTU/sq ft)');
    BuildCalc.setResult('res-ceiling', ceilingAdj === 1 ? 'None (8 ft standard)' : '×' + BuildCalc.fmt(ceilingAdj) + ' (' + BuildCalc.fmt(ceilingHeight) + ' ft ceiling)');
    BuildCalc.setResult('res-insulation', insulation.charAt(0).toUpperCase() + insulation.slice(1) + ' (×' + insFactor + ')');
    BuildCalc.setResult('res-climate', climate.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (×' + climFactor + ')');
    BuildCalc.setResult('res-sun', sunExposure.charAt(0).toUpperCase() + sunExposure.slice(1) + ' (×' + sunFactor + ')');
    BuildCalc.setResult('res-occupant', occupantBtu > 0 ? '+' + BuildCalc.fmt(occupantBtu, 0) + ' BTU (' + occupants + ' people)' : 'Standard (≤2 people)');
    BuildCalc.setResult('res-btu', BuildCalc.fmt(totalBtu, 0) + ' BTU/hr');
    BuildCalc.setResult('res-tons', mode === 'cooling' ? BuildCalc.fmt(tons) + ' tons' : 'N/A (heating mode)');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(totalBtu, 0) + ' BTU/hr ' + (mode === 'cooling' ? '(' + BuildCalc.fmt(tons) + ' ton AC)' : '(heating)'));

    BuildCalc.showResults('results');
  });
});
