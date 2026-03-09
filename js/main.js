/* === TradeTools Shared Utilities === */
const TradeTools = {
  // Unit conversions
  feetToInches: (ft) => ft * 12,
  inchesToFeet: (inches) => inches / 12,
  sqFtToSqYd: (sqft) => sqft / 9,
  cubicFtToCubicYd: (cuft) => cuft / 27,
  cubicYdToCubicFt: (cuyd) => cuyd * 27,

  // Formatting
  fmt: (num, decimals = 2) => {
    if (num === 0) return '0';
    const n = parseFloat(num.toFixed(decimals));
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  },

  fmtCurrency: (num) => {
    return '$' + parseFloat(num.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // Validation
  getNum: (id) => {
    const el = document.getElementById(id);
    const val = parseFloat(el.value);
    if (isNaN(val) || val < 0) {
      el.classList.add('input-error');
      return null;
    }
    el.classList.remove('input-error');
    return val;
  },

  getPositive: (id) => {
    const val = TradeTools.getNum(id);
    if (val === null || val <= 0) {
      document.getElementById(id).classList.add('input-error');
      return null;
    }
    return val;
  },

  getInt: (id) => {
    const el = document.getElementById(id);
    const val = parseInt(el.value);
    if (isNaN(val) || val < 0) {
      el.classList.add('input-error');
      return null;
    }
    el.classList.remove('input-error');
    return val;
  },

  clearErrors: () => {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  },

  // Results display
  showResults: (containerId) => {
    const box = document.getElementById(containerId);
    if (box) { box.classList.add('visible'); box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  },

  setResult: (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  // Rounding helpers
  roundUp: (num) => Math.ceil(num),
  roundHalf: (num) => Math.ceil(num * 2) / 2,
};

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
});
