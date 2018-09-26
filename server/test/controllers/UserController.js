import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

const bearer = 'Bearer ';
let userToken;
let adminToken;

describe('UserController.fetchOrders', () => {
  it('should get the order history for a particular user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@mail.com', password: process.env.ADMIN_PASSWORD
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        adminToken = bearer + res.body.data.token;
        chai.request(app)
          .post('/api/v1/menu')
          .set('Authorization', adminToken)
          .send({
            foodName: 'Chicken Burger10',
            price: 1200,
            imageUrl: 'https://res.cloudinary.com/ah-med/image/upload/v1537442340/fastfoodImage/continental/burger-chicken.jpg',
            category: 'Continental'
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            const { foodId } = res.body.data[0];
            chai.request(app)
              .post('/api/v1/auth/signup')
              .send({
                firstName: 'afirstname10', lastName: 'alastname10', email: 'newUser10@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                const { userId } = res.body.data;
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser10@mail.com', password: '12345678'
                  })
                  .end((err, res) => {
                    expect(res.status).to.equal(200);
                    userToken = bearer + res.body.data.token;
                    chai.request(app)
                      .post('/api/v1/orders')
                      .set('Authorization', userToken)
                      .send({
                        phoneNo: '12345678901', address: 'my home town', foodItems: [{ foodId, quantity: 4 }],
                      })
                      .end((err, res) => {
                        expect(res.status).to.equal(201);
                        chai.request(app)
                          .get(`/api/v1/users/${userId}/orders`)
                          .set('Authorization', userToken)
                          .end((err, res) => {
                            expect(res.status).to.equal(200);
                            expect(res.body).to.have.property('data');
                            expect(res.body.data[0].status).to.equal('New');
                            expect(res.body).to.have.property('message');
                            expect(res.body.message).to.equal('success');
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});
