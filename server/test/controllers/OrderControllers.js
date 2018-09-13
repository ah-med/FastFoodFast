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
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
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

describe('OrderController.update', () => {
  // create an order first get the Id and use it to update another order
  it('should accept an order', (done) => {
    chai.request(app)
      .post('/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { orderId } = res.body.data[0];
        chai.request(app)
          .put(`/orders/${orderId}`)
          .send({
            status: 'Accept'
          })
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.status).to.equal(200);
            done();
          });
      });
  });
  it('should decline an order', (done) => {
    chai.request(app)
      .post('/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { orderId } = res.body.data[0];
        chai.request(app)
          .put(`/orders/${orderId}`)
          .send({
            status: 'Decline'
          })
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.status).to.equal(200);
            done();
          });
      });
  });
});

describe('OrderController.getOrder', () => {
  // create an order first get the Id and use it to update another order
  it('should accept an order', (done) => {
    chai.request(app)
      .post('/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { orderId } = res.body.data[0];
        chai.request(app)
          .get(`/orders/${orderId}`)
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.status).to.equal(200);
            done();
          });
      });
  });
});

describe('OrderController.getAllOrders', () => {
  it('should accept an order', (done) => {
    chai.request(app)
      .post('/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        chai.request(app)
          .get('/orders')
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.status).to.equal(200);
            done();
          });
      });
  });
});
