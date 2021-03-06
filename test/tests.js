process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

var storage = require('node-persist');
var testStorage;

chai.use(chaiHttp);

describe('API Tests', function() {
    before(function () {
        testStorage = storage.create({dir: 'test/storage'});
        testStorage.initSync();
        testStorage.clearSync();
    });

    after(function() {
        testStorage.clearSync();
    });

    describe('Producer API', function() {
        it('should GET denied if asking for a product without providing a merchant_id',(done) =>
        {
            chai.request(server)
                .get('/buy')
                .end(function(err, res){
                    res.should.have.status(400);
                    done();
                });
        });

        var decryption_key;
        it('should give me a key to decrypt the product hash',(done) =>
        {
            chai.request(server)
            .get('/decryption_key')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('decryption_key');
                res.body.decryption_key.should.be.a('string');
                decryption_key = res.body.decryption_key;
                done();
            });
        });


        it('should give me a random product',(done) =>
        {
            chai.request(server)
            .get('/buy?merchant_id=12345')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.have.property('uid');
                res.body.uid.should.be.a('number');

                res.body.should.have.property('product_id');
                res.body.product_id.should.be.a('number');

                res.body.should.have.property('name');
                res.body.name.should.be.a('string');

                res.body.should.have.property('quality');
                res.body.quality.should.be.a('number');

                res.body.should.have.property('price');
                res.body.price.should.be.a('number');

                res.body.should.have.property('amount');
                res.body.amount.should.be.a('number');

                res.body.should.have.property('signature');
                res.body.signature.should.be.a('string');
                
                done();
            });
        });

    });
});
