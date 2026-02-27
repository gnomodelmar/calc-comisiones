// Logic for price calculation
function calculateEffectiveCommission(base, financ, includeIVA) {
  const sum = base + financ;
  if (!includeIVA) {
    return sum * 1.21;
  }
  return sum;
}

function calculateFinalPrice(netAmount, effectiveCommission) {
  // Price = Net / (1 - EffComm/100)
  if (effectiveCommission >= 100) {
      throw new Error("Commission cannot be 100% or more");
  }
  const factor = 1 - (effectiveCommission / 100);
  return netAmount / factor;
}

module.exports = { calculateEffectiveCommission, calculateFinalPrice };