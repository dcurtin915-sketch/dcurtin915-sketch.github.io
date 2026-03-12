document.addEventListener('DOMContentLoaded', () => {
  // NEC Chapter 9 Table 4 - Conduit internal areas (sq inches)
  const conduitAreas = {
    emt:   { '0.5': 0.304, '0.75': 0.533, '1': 0.864, '1.25': 1.496, '1.5': 2.036, '2': 3.356, '2.5': 5.858, '3': 8.846, '4': 15.68 },
    pvc40: { '0.5': 0.285, '0.75': 0.508, '1': 0.832, '1.25': 1.453, '1.5': 1.986, '2': 3.291, '2.5': 5.453, '3': 8.091, '4': 14.57 },
    pvc80: { '0.5': 0.217, '0.75': 0.409, '1': 0.688, '1.25': 1.237, '1.5': 1.711, '2': 2.874, '2.5': 4.764, '3': 7.142, '4': 12.88 },
    rmc:   { '0.5': 0.314, '0.75': 0.549, '1': 0.887, '1.25': 1.526, '1.5': 2.071, '2': 3.408, '2.5': 4.866, '3': 7.499, '4': 13.2  }
  };

  // NEC Chapter 9 Table 5 - Wire areas (sq inches) including insulation
  const wireAreas = {
    thhn: { '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366, '6': 0.0507, '4': 0.0824, '3': 0.0973, '2': 0.1158, '1': 0.1562, '1/0': 0.1855, '2/0': 0.2223, '3/0': 0.2679, '4/0': 0.3237 },
    thw:  { '14': 0.0139, '12': 0.0181, '10': 0.0243, '8': 0.0437, '6': 0.0726, '4': 0.1087, '3': 0.1263, '2': 0.1473, '1': 0.1901, '1/0': 0.2223, '2/0': 0.2624, '3/0': 0.3117, '4/0': 0.3718 },
    xhhw: { '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366, '6': 0.0507, '4': 0.0824, '3': 0.0973, '2': 0.1158, '1': 0.1562, '1/0': 0.1855, '2/0': 0.2223, '3/0': 0.2679, '4/0': 0.3237 }
  };

  const wireGroups = [];

  function renderWireList() {
    const list = document.getElementById('wire-list');
    if (wireGroups.length === 0) { list.innerHTML = '<p style="color:#64748b;font-size:.9rem;">No wires added yet. Add wire groups above.</p>'; return; }
    list.innerHTML = wireGroups.map((g, i) =>
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem .6rem;background:#f1f5f9;border-radius:6px;margin-bottom:.3rem;">' +
      '<span>' + g.count + '× ' + g.size + ' AWG ' + g.insulation.toUpperCase() + ' (' + BuildCalc.fmt(g.area, 4) + ' sq in each)</span>' +
      '<button onclick="removeWire(' + i + ')" style="background:#ef4444;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;">✕</button></div>'
    ).join('');
  }

  window.removeWire = function(i) { wireGroups.splice(i, 1); renderWireList(); };

  document.getElementById('add-wire-btn').addEventListener('click', () => {
    const size = document.getElementById('wireSize').value;
    const insulation = document.getElementById('wireInsulation').value;
    const count = parseInt(document.getElementById('wireCount').value) || 1;
    const area = wireAreas[insulation][size];
    if (!area) return;
    wireGroups.push({ size, insulation, count, area });
    renderWireList();
  });

  renderWireList();

  document.getElementById('calc-btn').addEventListener('click', () => {
    BuildCalc.clearErrors();
    if (wireGroups.length === 0) { alert('Add at least one wire group first.'); return; }

    const conduitType = document.getElementById('conduitType').value;
    const conduitSize = document.getElementById('conduitSize').value;
    const conduitArea = conduitAreas[conduitType][conduitSize];
    if (!conduitArea) return;

    let totalWireArea = 0;
    let totalWires = 0;
    wireGroups.forEach(g => { totalWireArea += g.area * g.count; totalWires += g.count; });

    // NEC Table 1 fill limits
    let necPct;
    if (totalWires === 1) necPct = 53;
    else if (totalWires === 2) necPct = 31;
    else necPct = 40;

    const allowableArea = conduitArea * (necPct / 100);
    const fillPct = (totalWireArea / conduitArea) * 100;
    const compliant = fillPct <= necPct;

    const typeNames = { emt: 'EMT', pvc40: 'PVC Sch 40', pvc80: 'PVC Sch 80', rmc: 'RMC' };

    BuildCalc.setResult('res-conduit', typeNames[conduitType] + ' ' + conduitSize + '"');
    BuildCalc.setResult('res-conduit-area', BuildCalc.fmt(conduitArea, 3) + ' sq in');
    BuildCalc.setResult('res-allowable', BuildCalc.fmt(allowableArea, 3) + ' sq in (' + necPct + '% of ' + BuildCalc.fmt(conduitArea, 3) + ')');
    BuildCalc.setResult('res-wire-area', BuildCalc.fmt(totalWireArea, 4) + ' sq in (' + totalWires + ' conductors)');
    BuildCalc.setResult('res-fill-pct', BuildCalc.fmt(fillPct, 1) + '%');
    BuildCalc.setResult('res-nec-limit', necPct + '% (' + totalWires + ' conductor' + (totalWires > 1 ? 's' : '') + ')');
    BuildCalc.setResult('res-compliance', compliant ? '✅ PASS — Within NEC limits' : '❌ FAIL — Exceeds NEC fill limit');
    BuildCalc.setResult('res-highlight', BuildCalc.fmt(fillPct, 1) + '% fill — ' + (compliant ? 'NEC COMPLIANT ✅' : 'EXCEEDS LIMIT ❌'));

    BuildCalc.showResults('results');
  });
});
