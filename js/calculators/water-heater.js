document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    const people = BuildCalc.getPositive('people');
    const bathrooms = BuildCalc.getPositive('bathrooms');
    if (!people || !bathrooms) return;

    const showers = parseInt(document.getElementById('showers').value) || 0;
    const bathFill = parseInt(document.getElementById('bathFill').value) || 0;
    const dishwasher = parseInt(document.getElementById('dishwasher').value) || 0;
    const clothesWasher = parseInt(document.getElementById('clothesWasher').value) || 0;
    const handWash = parseInt(document.getElementById('handWash').value) || 0;
    const inletTemp = parseFloat(document.getElementById('inletTemp').value) || 50;

    // Peak hour demand (gallons) - DOE/ENERGY STAR values
    const peakGallons = (showers * 20) + (bathFill * 36) + (dishwasher * 14) + (clothesWasher * 30) + (handWash * 4);

    // GPM for simultaneous fixtures
    const gpmValues = { shower: 2.0, bath: 4.0, dishwasher: 1.5, clothesWasher: 2.0, handWash: 1.0 };
    const peakGPM = (showers * gpmValues.shower) + (bathFill * gpmValues.bath) + (dishwasher * gpmValues.dishwasher) + (clothesWasher * gpmValues.clothesWasher) + (handWash * gpmValues.handWash);

    // Temperature rise
    const outputTemp = 120; // standard
    const tempRise = outputTemp - inletTemp;

    // Tank sizing: FHR should match or exceed peak demand
    const fhr = peakGallons;
    let tankSize;
    if (fhr <= 40) tankSize = 30;
    else if (fhr <= 55) tankSize = 40;
    else if (fhr <= 70) tankSize = 50;
    else if (fhr <= 85) tankSize = 65;
    else if (fhr <= 100) tankSize = 75;
    else tankSize = 80;

    // Tankless BTU: GPM × ΔT × 500 (water heating formula)
    const tanklessBTU = Math.ceil(peakGPM * tempRise * 500);

    BuildCalc.setResult('res-peak', BuildCalc.fmt(peakGallons, 0) + ' gallons/hour');
    BuildCalc.setResult('res-gpm', BuildCalc.fmt(peakGPM, 1) + ' GPM (simultaneous)');
    BuildCalc.setResult('res-rise', tempRise + '°F (' + inletTemp + '°F → ' + outputTemp + '°F)');
    BuildCalc.setResult('res-fhr', '≥ ' + BuildCalc.fmt(fhr, 0) + ' gal/hr First Hour Rating');
    BuildCalc.setResult('res-tank', tankSize + '-gallon tank');
    BuildCalc.setResult('res-tankless', BuildCalc.fmt(peakGPM, 1) + ' GPM minimum');
    BuildCalc.setResult('res-btu', BuildCalc.fmt(tanklessBTU, 0) + ' BTU/hr');
    BuildCalc.setResult('res-highlight', tankSize + '-gal tank or ' + BuildCalc.fmt(peakGPM, 1) + ' GPM tankless');

    BuildCalc.showResults('results');
  });
});
