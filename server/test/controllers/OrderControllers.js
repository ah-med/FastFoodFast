import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('OrderController.create', () => {
  it('should create an order', (done) => {
    chai.request(app)
      .post('/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{"itemId": 1, "quantity": 4}]
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.status).to.equal(201);
        done();
      });
  });
});
