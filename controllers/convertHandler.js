const Ut = require('../utils/utils');

function ConvertHandler() {
  
  /*
  Object who contain converter helper params
  */
  this.units_data = {
    'l': {
      'in_unit': 'L',
      'in_str': 'liters',
      'out_unit': 'gal',
      'oposite': true,
      'group': 'galToL'
    },
    'gal': {
      'in_str': 'gallons',
      'out_unit': 'L',
      'group': 'galToL'
    },
    'mi': {
      'in_str': 'miles',
      'out_unit': 'km',
      'group': 'miToKm'
    },
    'km': {
      'in_str': 'kilometers',
      'out_unit': 'mi',
      'oposite': true,
      'group': 'miToKm'
    },
    'kg': {
      'in_str': 'kilograms',
      'out_unit': 'lbs',
      'oposite': true,
      'group': 'lbsToKg'
    },
    'lbs': {
      'in_str': 'pounds',
      'out_unit': 'kg',
      'group': 'lbsToKg'
    },
  }
  this.regex = {
    'num': /^(?<num>(?<nDiv>\d+(\.\d+)?)\/?(?<nNum>\d+(\.\d+)?)?)?(?<unit>[a-zA-Z]+)?$/i,
    'unit': /^(?<num>[0-9\.\/\-]+)?(?<unit>km|mi|gal|L|lbs|kg)$/i
  }
  
  this.isFraction = (num) => {
    return num && num.includes('/')
  }

  this.calcFraction = (div, numerator) => {
    return (div && numerator && numerator > 0) ? Number(div) / Number(numerator): null;
  }

  this.formatMatchNumber = (groups) => {
    let result
    if(groups){
      const {num, nDiv, nNum} = groups
      if(this.isFraction(num) && nDiv && nNum ){
      
        result = Ut.toFixedFloat(this.calcFraction(nDiv, nNum), 5)
      }
      else if(this.isDecimal(num)){
        result = Ut.toFixedFloat(Number(num), 5)
      }
      else{
        result = Number(num)
      }
    }
    
    return result
  }

  this.formatNumber = (num) => {
    return (num) ? Ut.toFixedFloat(Number(num), 5): num;
  }
  
  this.isDecimal = (num) => {
    return num && num.includes('.')
  }
  
  this.getNum = function(input) {
    let result;
    
    let z = input.match(this.regex.num);
    
    if(z && z.groups && z.groups.num){
      result = this.formatMatchNumber(z.groups);
    }
    else if(z && z.groups && !z.groups.num && z.groups.unit){
      result = 1;
    }
    return result;
  };
  this.getUnitKey = (value) => {
    return (Ut.isStr(value)) ? value.toLowerCase() : value;
  }
  
  this.getUnitCase = (value) => {
    const key = this.getUnitKey(value);
    return (this.units_data[key] && this.units_data[key]['in_unit']) ? this.units_data[key]['in_unit'] : key;
  }
  
  this.getUnit = (input) => {
    let result;
    let z = input.match(this.regex.unit)
    if(z && z.groups && z.groups.unit){
      
      result = this.getUnitCase(z.groups.unit);
    }
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    const key = this.getUnitKey(initUnit)
    let result = (this.units_data[key]) ? this.units_data[key].out_unit : '';
    return result;
  };

  this.spellOutUnit = function(unit) {
    const key = this.getUnitKey(unit)
    let result = (this.units_data[key]) ? this.units_data[key].in_str : '';
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    const key = this.getUnitKey(initUnit);
    if(this.units_data[key]){
      const units = this.units_data[key];
      const calc_convert = (num, coef, oposite=false) => {
        if(oposite === true && coef > 0){
          return num/coef
        }
        else{
          return num * coef
        }
      }
      if (units['group'] === 'galToL'){
        result = calc_convert(initNum, galToL, units['oposite'] )
      }
      else if(units['group'] === 'lbsToKg'){
        result = calc_convert(initNum, lbsToKg, units['oposite'] )
      }
      else if(units['group'] === 'miToKm'){
        result = calc_convert(initNum, miToKm, units['oposite'] )
      }
    }
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    
    return result;
  };

  this.convertTo = (input) => {
    let result;
    if(input){
      const num = this.getNum(input);
      const unit = this.getUnit(input);
      if(num && unit){
        const returnNum = this.formatNumber(this.convert(num, unit));
        const returnUnit = this.getReturnUnit(unit);
        const returnStr = this.getString(num, unit, returnNum, returnUnit);
        
        result = this.formatResult({
          initNum: this.formatNumber(num),
          initUnit: unit,
          returnNum: returnNum,
          returnUnit: returnUnit,
          string: returnStr
        })
      }
      else{
        result = this.formatResult({
          initNum: this.formatNumber(num),
          initUnit: unit
        })
      }
    }
    return result
  }
  
  this.isEmptyValue = (value) => {
    return !value || value === undefined
  }
  
  this.formatResult = (obj) => {
    let result;
    const num = (obj && obj.initNum) ? obj.initNum : null;
    const unit = (obj && obj.initUnit) ? obj.initUnit : null;
    if(this.isEmptyValue(num) && this.isEmptyValue(unit)){
      result = 'invalid number and unit'
    }
    else if(this.isEmptyValue(num)){
      result = 'invalid number'
    }
    else if(this.isEmptyValue(unit)){
      result = 'invalid unit'
    }
    else{
      result = obj
    }
    return result
  }
  
}

module.exports = ConvertHandler;
