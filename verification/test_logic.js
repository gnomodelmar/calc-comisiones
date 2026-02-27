const assert = require('node:assert');
const { calculateEffectiveCommission, calculateFinalPrice } = require('./logic.js');

// Test 1: Commission without IVA (should multiply by 1.21)
// Base: 5, Financ: 5 -> Sum: 10 -> Result: 12.1
const commNoIVA = calculateEffectiveCommission(5, 5, false);
assert.strictEqual(commNoIVA, 12.1, 'Commission without IVA calculation failed');

// Test 2: Commission with IVA (should be sum)
// Base: 5, Financ: 5 -> Sum: 10 -> Result: 10
const commWithIVA = calculateEffectiveCommission(5, 5, true);
assert.strictEqual(commWithIVA, 10, 'Commission with IVA calculation failed');

// Test 3: Final Price Calculation
// Net: 100, EffComm: 20 -> Factor: 0.8 -> Price: 125
const price1 = calculateFinalPrice(100, 20);
assert.strictEqual(price1, 125, 'Final price calculation failed');

// Test 4: Final Price with Complex Commission
// Net: 10000, Base: 3, Financ: 0, No IVA -> Eff: 3.63
// Price = 10000 / (1 - 0.0363) = 10000 / 0.9637 = 10376.673...
const effCommComplex = calculateEffectiveCommission(3, 0, false);
const price2 = calculateFinalPrice(10000, effCommComplex);
assert.ok(Math.abs(price2 - 10376.67) < 0.01, 'Complex price calculation failed');

console.log('All logic tests passed!');