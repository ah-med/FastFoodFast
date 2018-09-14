import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('assignOrderStatus.update middleware', () => {
  it('should not mark an order pending approval as complete', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { orderId } = res.body.data[0];
        chai.request(app)
          .put(`/api/v1/orders/${orderId}`)
          .send({
            status: 'Complete'
          })
          .end((err, res) => {
            expect(res.body.error).to.have.property('status');
            expect(res.body.error).to.have.property('title');
            expect(res.body.error).to.have.property('description');
            expect(res.status).to.equal(403);
            done();
          });
      });
  });
  it('should accept an order', (done) => {
    chai.request(app)
      .post('/api/v1/orders')
      .send({
        name: 'Joe Jackson', phoneNo: '12345678901', address: 'my home town', foodItems: [{ itemId: 1, quantity: 4 }],
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        const { orderId } = res.body.data[0];
        chai.request(app)
          .put(`/api/v1/orders/${orderId}`)
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
});
