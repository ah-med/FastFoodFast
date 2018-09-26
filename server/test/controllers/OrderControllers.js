import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

const bearer = 'Bearer ';
let adminToken;
let userToken;
describe('OrderController.create', () => {
  it('should create an order', (done) => {
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
            foodName: 'Chicken Burger2',
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
                firstName: 'afirstname1', lastName: 'alastname1', email: 'newUser1@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser1@mail.com', password: '12345678'
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
                        expect(res.body).to.have.property('status');
                        expect(res.body).to.have.property('message');
                        expect(res.body.message).to.equal('Order placed successfully!');
                        expect(res.body).to.have.property('data');
                        expect(res.status).to.equal(201);
                        done();
                      });
                  });
              });
          });
      });
  });
});

describe('OrderController.update', () => {
  it('should update an order', (done) => {
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
            foodName: 'Chicken Burger3',
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
                firstName: 'afirstname2', lastName: 'alastname2', email: 'newUser2@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser2@mail.com', password: '12345678'
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
                          .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                          .set('Authorization', adminToken)
                          .send({
                            status: 'Process'
                          })
                          .end((err, res) => {
                            expect(res.status).to.equal(200);
                            expect(res.body).to.have.property('data');
                            expect(res.body.data[0]).to.have.property('status');
                            expect(res.body.data[0].status).to.equal('Processing');
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});

describe('OrderController.getOrder', () => {
  it('should get an order', (done) => {
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
            foodName: 'Chicken Burger20',
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
                firstName: 'afirstname20', lastName: 'alastname20', email: 'newUser20@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser20@mail.com', password: '12345678'
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
                          .get(`/api/v1/orders/${res.body.data[0].order_id}`)
                          .set('Authorization', adminToken)
                          .end((err, res) => {
                            expect(res.status).to.equal(200);
                            expect(res.body).to.have.property('data');
                            expect(res.body.data[0]).to.have.property('status');
                            expect(res.body.data[0].status).to.equal('New');
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});

describe('OrderController.getAllOrder', () => {
  it('should get all orders', (done) => {
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
            foodName: 'Chicken Burger30',
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
                firstName: 'afirstname30', lastName: 'alastname30', email: 'newUser30@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser30@mail.com', password: '12345678'
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
                          .get('/api/v1/orders/')
                          .set('Authorization', adminToken)
                          .end((err, res) => {
                            expect(res.status).to.equal(200);
                            expect(res.body).to.have.property('data');
                            expect(res.body.data[0]).to.have.property('status');
                            expect(res.body.data[0].status).to.equal('New');
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
});
