import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../../index';

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;
const bearer = 'Bearer ';
let adminToken;

describe('Menu controller methods', () => {
  it('should add a meal to the menu', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@mail.com', password: process.env.ADMIN_PASS
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        adminToken = bearer + res.body.data.token;
        chai.request(app)
          .post('/api/v1/menu')
          .set('Authorization', adminToken)
          .send({
            itemName: 'Chicken Burger',
            quantity: 8,
            price: 1200,
            imageUrl: 'https://res.cloudinary.com/ah-med/image/upload/v1537442340/fastfoodImage/continental/burger-chicken.jpg',
            category: 'Continental'
          })
          .end((err, res) => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('foodId');
            expect(res.body.data[0]).to.have.property('timesOrdered');
            expect(res.body.data[0]).to.have.property('itemName');
            expect(res.body.data[0]).to.have.property('quantity');
            expect(res.body.data[0]).to.have.property('price');
            expect(res.body.data[0]).to.have.property('imageUrl');
            expect(res.body.data[0]).to.have.property('category');
            expect(res.status).to.equal(201);
            done();
          });
      });
  });
  it('should get all available menu', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@mail.com', password: process.env.ADMIN_PASS
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        adminToken = bearer + res.body.data.token;
        chai.request(app)
          .post('/api/v1/menu')
          .set('Authorization', adminToken)
          .send({
            itemName: 'Chicken Burger',
            quantity: 8,
            price: 1200,
            imageUrl: 'https://res.cloudinary.com/ah-med/image/upload/v1537442340/fastfoodImage/continental/burger-chicken.jpg',
            category: 'Continental'
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            chai.request(app)
              .get('/api/v1/menu')
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
              });
          });
      });
  });
});
