const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');
const Ut = require('../utils/utils');
let convertHandler = new ConvertHandler();
const galToL = 3.78541;
const lbsToKg = 0.453592;
const miToKm = 1.60934;
suite('Unit Tests', function () {
    suite('Test convertHandler', function () {
        test('read a whole number input', function () {
            assert.strictEqual(convertHandler.getNum('300'), (300))
            assert.strictEqual(convertHandler.getNum('3.12345'), Ut.toFixedFloat(3.12345, 5))
        });

        test('read a decimal number input', function () {
            assert.strictEqual(convertHandler.getNum('3.12345L'), 3.12345)
        });

        test('read a fractional number input', function () {
            assert.strictEqual(convertHandler.getNum('3/2L'), Ut.toFixedFloat(3 / 2, 5))
        });

        test('read a fractional number input with a decimal.', function () {
            assert.strictEqual(convertHandler.getNum('3.2/2.12345gal'), Ut.toFixedFloat((3.2 / 2.12345), 5))
        });

        test('return an error on a double-fraction', function () {
            assert.isUndefined(convertHandler.getNum('3/2/3L'))
        });

        test('default to a numerical input of 1 when no numerical input is provided', function () {
            assert.strictEqual(convertHandler.getNum('L'), 1)
        });

        test('read each valid input unit', function () {
            assert.strictEqual(convertHandler.getUnit('L'), 'L')
            assert.strictEqual(convertHandler.getUnit('gal'), 'gal')
            assert.strictEqual(convertHandler.getUnit('mi'), 'mi')
            assert.strictEqual(convertHandler.getUnit('km'), 'km')
            assert.strictEqual(convertHandler.getUnit('lbs'), 'lbs')
            assert.strictEqual(convertHandler.getUnit('kg'), 'kg')
        });

        test('return an error for an invalid input unit', function () {
            assert.isUndefined(convertHandler.getUnit('Lt'))
        });

        test('correct return unit for each valid input unit', function () {
            assert.strictEqual(convertHandler.getReturnUnit('L'), 'gal')
            assert.strictEqual(convertHandler.getReturnUnit('gal'), 'L')
            assert.strictEqual(convertHandler.getReturnUnit('mi'), 'km')
            assert.strictEqual(convertHandler.getReturnUnit('km'), 'mi')
            assert.strictEqual(convertHandler.getReturnUnit('lbs'), 'kg')
            assert.strictEqual(convertHandler.getReturnUnit('kg'), 'lbs')
        });

        test('return the spelled-out string unit for each valid input', function () {
            assert.strictEqual(convertHandler.spellOutUnit('L'), 'liters')
            assert.strictEqual(convertHandler.spellOutUnit('gal'), 'gallons')
            assert.strictEqual(convertHandler.spellOutUnit('mi'), 'miles')
            assert.strictEqual(convertHandler.spellOutUnit('km'), 'kilometers')
            assert.strictEqual(convertHandler.spellOutUnit('lbs'), 'pounds')
            assert.strictEqual(convertHandler.spellOutUnit('kg'), 'kilograms')
        });

        test('should correctly convert gal to L', function () {
            assert.strictEqual(convertHandler.convert(1, 'gal'), 1 * galToL)
            assert.strictEqual(convertHandler.convert(15, 'gal'), 15 * galToL)
            assert.strictEqual(convertHandler.convert(15, 'gAl'), 15 * galToL)
        });

        test('should correctly convert L to gal', function () {
            assert.strictEqual(convertHandler.convert(1, 'L'), 1 / galToL)
        });

        test('should correctly convert mi to km', function () {
            assert.strictEqual(convertHandler.convert(1, 'mi'), 1 * miToKm)
        });

        test('should correctly convert km to mi.', function () {
            assert.strictEqual(convertHandler.convert(1, 'km'), 1 / miToKm)
        });

        test('should correctly convert lbs to kg.', function () {
            assert.strictEqual(convertHandler.convert(1, 'lbs'), 1 * lbsToKg)
        });

        test('should correctly convert kg to lbs.', function () {
            assert.strictEqual(convertHandler.convert(1, 'kg'), 1 / lbsToKg)
            assert.strictEqual(convertHandler.convert(10, 'kG'), 10 / lbsToKg)
            assert.strictEqual(convertHandler.convert(15, 'KG'), 15 / lbsToKg)
        });
    });
});