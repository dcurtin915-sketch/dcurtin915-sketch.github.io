document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();

    const projectSqFt = BuildCalc.getPositive('project-sqft');
    if (!projectSqFt) return;

    const projectType = document.getElementById('project-type').value;
    const debrisWeight = document.getElementById('debris-weight').value;

    // Debris factor: cubic yards per square foot of project area
    var debrisFactors = {
      'cleanout':         0.010,
      'remodel-small':    0.020,
      'remodel-large':    0.025,
      'roofing':          0.012,
      'demo-interior':    0.025,
      'demo-full':        0.045,
      'deck':             0.015,
      'landscaping':      0.008,
      'new-construction': 0.015
    };

    var projectLabels = {
      'cleanout':         'Home cleanout',
      'remodel-small':    'Small remodel',
      'remodel-large':    'Large remodel',
      'roofing':          'Roofing tear-off',
      'demo-interior':    'Interior demolition',
      'demo-full':        'Full demolition',
      'deck':             'Deck removal',
      'landscaping':      'Landscaping / yard',
      'new-construction': 'New construction'
    };

    var factor = debrisFactors[projectType] || 0.015;
    var estimatedVolume = projectSqFt * factor;

    // Adjust for debris weight
    if (debrisWeight === 'heavy') {
      estimatedVolume *= 0.8; // heavy packs denser, less volume but more weight
    } else if (debrisWeight === 'light') {
      estimatedVolume *= 1.2; // light debris is bulkier
    }

    // Recommend standard dumpster size
    var dumpsterSizes = [10, 15, 20, 30, 40];
    var dumpsterDims = {
      10: '12\' × 8\' × 3.5\'',
      15: '16\' × 7.5\' × 4.5\'',
      20: '22\' × 7.5\' × 4.5\'',
      30: '22\' × 7.5\' × 6\'',
      40: '22\' × 7.5\' × 8\''
    };
    var dumpsterWeights = {
      10: '2–4 tons',
      15: '3–5 tons',
      20: '4–6 tons',
      30: '5–8 tons',
      40: '6–10 tons'
    };
    var dumpsterCosts = {
      10: '$300–$450',
      15: '$350–$500',
      20: '$400–$600',
      30: '$450–$700',
      40: '$500–$800'
    };

    // For heavy debris, cap at 20 yard
    var maxSize = debrisWeight === 'heavy' ? 20 : 40;

    var recommended = 10;
    for (var i = 0; i < dumpsterSizes.length; i++) {
      if (dumpsterSizes[i] >= estimatedVolume && dumpsterSizes[i] <= maxSize) {
        recommended = dumpsterSizes[i];
        break;
      }
      if (i === dumpsterSizes.length - 1) {
        recommended = Math.min(dumpsterSizes[i], maxSize);
      }
    }

    // Pickup truck equivalent (~1.5 cu yd per full-size truck bed)
    var truckLoads = Math.ceil(estimatedVolume / 1.5);

    BuildCalc.setResult('res-highlight', recommended + '-yard dumpster');
    BuildCalc.setResult('res-project', projectLabels[projectType]);
    BuildCalc.setResult('res-volume', BuildCalc.fmt(estimatedVolume) + ' cubic yards estimated');
    BuildCalc.setResult('res-size', recommended + '-yard dumpster');
    BuildCalc.setResult('res-dims', dumpsterDims[recommended]);
    BuildCalc.setResult('res-weight', dumpsterWeights[recommended]);
    BuildCalc.setResult('res-cost', dumpsterCosts[recommended] + ' (typical 7-day rental)');
    BuildCalc.setResult('res-trucks', '≈ ' + truckLoads + ' full pickup truck load' + (truckLoads !== 1 ? 's' : ''));

    BuildCalc.showResults('results');
  });
});
