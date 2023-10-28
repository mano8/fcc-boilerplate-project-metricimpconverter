'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');
const Ut = require('../utils/utils');
module.exports = function (app) {

  let convertHandler = new ConvertHandler();

  const formatNumber = (num) => {
    return (num) ? utils.round(Number(num), 5) : num;
  }

  const isResult = (data) => {
    return (
      data && data.initNum
      && data.initUnit && data.returnNum
      && data.returnUnit && data.string)
  }

  app.get('/api/convert',
    (req, res) => {
      const input = (req.query.input) ? req.query.input : '';
      console.log("input to convert: ", input)

      let result = convertHandler.convertTo(input);
      if (isResult(result)) {
        console.log("convert result: ", result)
        res.json(result);
        return;
      }
      else {
        result = (!result) ? convertHandler.formatResult({ initNum: formatNumber(num), unit: unit }) : result
        console.log("convert result error: ", result)
        res
          .type('text')
          .send(result)
        return;
      }



    });

};
