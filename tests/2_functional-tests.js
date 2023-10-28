const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000);
    suite('test /api/convert', function () {
        test('Test GET /api/convert with 10L', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=10L')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log('test /api/convert -> body: ', res.body)
                    assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");
                    done();
                });
        });

        test('Test GET /api/convert with 32g', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=32g')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log('test /api/convert -> text: ', res.text)
                    assert.equal(res.text, 'invalid unit');
                    done();
                });
        });

        test('Test GET /api/convert with 3/7.2/4kg', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=3/7.2/4kg')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log('test /api/convert with 3/7.2/4kg-> text: ', res.text)
                    assert.equal(res.text, 'invalid number');
                    done();
                });
        });

        test('Test GET /api/convert with 3/7.2/4kilomegagram', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=3/7.2/4kilomegagram')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log('test /api/convert with 3/7.2/4kilomegagram-> text: ', res.text)
                    assert.equal(res.text, 'invalid number and unit');
                    done();
                });
        });

        test('Test GET /api/convert with kg', function (done) {
            chai
                .request(server)
                .get('/api/convert?input=kg')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    console.log('test /api/convert with kg -> body: ', res.body)
                    assert.equal(res.body.string, '1 kilograms converts to 2.20462 pounds');
                    done();
                });
        });
    });
});
