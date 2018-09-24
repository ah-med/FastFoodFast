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
        email: 'admin@mail.com', password: process.env.ADMIN_PASSWORD
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        adminToken = bearer + res.body.data.token;
        chai.request(app)
          .post('/api/v1/menu')
          .set('Authorization', adminToken)
          .send({
            foodName: 'Chicken Burger',
            price: 1200,
            imageUrl: 'https://res.cloudinary.com/ah-med/image/upload/v1537442340/fastfoodImage/continental/burger-chicken.jpg',
            category: 'Continental'
          })
          .end((err, res) => {
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Menu added successfully');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('foodId');
            expect(res.body.data[0]).to.have.property('foodName');
            expect(res.body.data[0].foodName).to.equal('Chicken Burger');
            expect(res.body.data[0]).to.have.property('price');
            expect(res.body.data[0].price).to.equal(1200);
            expect(res.body.data[0]).to.have.property('imageUrl');
            expect(res.body.data[0].imageUrl).to.equal('https://res.cloudinary.com/ah-med/image/upload/v1537442340/fastfoodImage/continental/burger-chicken.jpg');
            expect(res.body.data[0]).to.have.property('category');
            expect(res.body.data[0].category).to.equal('Continental');
            expect(res.status).to.equal(201);
            done();
          });
      });
  });
  it('should get all available menu', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .end((err, res) => {
        expect(res.status).to.equal(200);

        done();
      });
  });
});
