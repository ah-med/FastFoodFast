import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

const bearer = 'Bearer ';
let adminToken;
let userToken;

describe('assignOrderStatus', () => {
  it('should only Process/Cancel an order that is New', (done) => {
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
            foodName: 'Chicken Burgerf',
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
                firstName: 'afirstname', lastName: 'alastname', email: 'newUser3@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser3@mail.com', password: '12345678'
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
                            status: 'Complete'
                          })
                          .end((err, res) => {
                            expect(res.status).to.equal(400);
                            expect(res.body).to.have.property('error');
                            expect(res.body.error).to.have.property('status');
                            expect(res.body.error.status).to.equal(400);
                            expect(res.body.error).to.have.property('title');
                            expect(res.body.error.title).to.equal('BAD_REQUEST');
                            expect(res.body.error).to.have.property('description');
                            expect(res.body.error.description).to.equal('you can only Process/Cancel an order that is New');
                            done();
                          });
                      });
                  });
              });
          });
      });
  });
  it('should not update a completed order', (done) => {
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
            foodName: 'Chicken Burgerj',
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
                firstName: 'afirstname', lastName: 'alastname', email: 'newUser4@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser4@mail.com', password: '12345678'
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
                            chai.request(app)
                              .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                              .set('Authorization', adminToken)
                              .send({
                                status: 'Complete'
                              })
                              .end((err, res) => {
                                expect(res.status).to.equal(200);
                                chai.request(app)
                                  .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                                  .set('Authorization', adminToken)
                                  .send({
                                    status: 'Process'
                                  })
                                  .end((err, res) => {
                                    expect(res.status).to.equal(400);
                                    expect(res.body).to.have.property('error');
                                    expect(res.body.error).to.have.property('status');
                                    expect(res.body.error.status).to.equal(400);
                                    expect(res.body.error).to.have.property('title');
                                    expect(res.body.error.title).to.equal('BAD_REQUEST');
                                    expect(res.body.error).to.have.property('description');
                                    expect(res.body.error.description).to.equal('you cannot update a completed order');
                                    done();
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
  it('should not update a cancelled order', (done) => {
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
            foodName: 'Chicken Burgern',
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
                firstName: 'afirstname', lastName: 'alastname', email: 'newUser5@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser5@mail.com', password: '12345678'
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
                            chai.request(app)
                              .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                              .set('Authorization', adminToken)
                              .send({
                                status: 'Cancel'
                              })
                              .end((err, res) => {
                                expect(res.status).to.equal(200);
                                chai.request(app)
                                  .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                                  .set('Authorization', adminToken)
                                  .send({
                                    status: 'Process'
                                  })
                                  .end((err, res) => {
                                    expect(res.status).to.equal(400);
                                    expect(res.body).to.have.property('error');
                                    expect(res.body.error).to.have.property('status');
                                    expect(res.body.error.status).to.equal(400);
                                    expect(res.body.error).to.have.property('title');
                                    expect(res.body.error.title).to.equal('BAD_REQUEST');
                                    expect(res.body.error).to.have.property('description');
                                    expect(res.body.error.description).to.equal('you cannot update a Cancelled order');
                                    done();
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });
  it('should only Complete/Cancel a Processing order', (done) => {
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
            foodName: 'Chicken Burgeri',
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
                firstName: 'afirstname', lastName: 'alastname', email: 'newUser6@mail.com', password: '12345678'
              })
              .end((err, res) => {
                expect(res.status).to.equal(201);
                chai.request(app)
                  .post('/api/v1/auth/login')
                  .send({
                    email: 'newUser6@mail.com', password: '12345678'
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
                            chai.request(app)
                              .put(`/api/v1/orders/${res.body.data[0].order_id}`)
                              .set('Authorization', adminToken)
                              .send({
                                status: 'Process'
                              })
                              .end((err, res) => {
                                expect(res.status).to.equal(400);
                                expect(res.body).to.have.property('error');
                                expect(res.body.error).to.have.property('status');
                                expect(res.body.error.status).to.equal(400);
                                expect(res.body.error).to.have.property('title');
                                expect(res.body.error.title).to.equal('BAD_REQUEST');
                                expect(res.body.error).to.have.property('description');
                                expect(res.body.error.description).to.equal('you can only Complete/Cancel a Processing order');
                                done();
                              });
                          });
                      });
                  });
              });
          });
      });
  });
});
