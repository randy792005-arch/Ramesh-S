// Utility to format currency as Indian Rupees
// Assumption: amounts stored in code are in USD. We apply a fixed exchange rate to convert to INR.
// Change EXCHANGE_RATE_USD_TO_INR if you want a different conversion rate or wire a live FX API.
const EXCHANGE_RATE_USD_TO_INR = 83; // 1 USD = 83 INR (example fixed rate)

export function toINR(amountUsd) {
  if (amountUsd == null || Number.isNaN(Number(amountUsd))) return '';
  const inr = Number(amountUsd) * EXCHANGE_RATE_USD_TO_INR;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inr);
}

export function toINRNumber(amountUsd) {
  if (amountUsd == null || Number.isNaN(Number(amountUsd))) return 0;
  return Number(amountUsd) * EXCHANGE_RATE_USD_TO_INR;
}
