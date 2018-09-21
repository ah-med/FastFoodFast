import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Authentication controller methods', () => {
  it('should register a new user account', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'afirstname', lastName: 'alastname', email: 'newUser@mail.com', password: '12345678'
      })
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('userId');
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data).to.have.property('role');
        expect(res.status).to.equal(201);
        done();
      });
  });
  it('should log in a registered user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'newUser@mail.com', password: '12345678'
      })
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('timeLoggedIn');
        expect(res.body.data).to.have.property('expiresIn');
        expect(res.status).to.equal(200);
        done();
      });
  });
});
