import bcrypt from 'bcryptjs';
import db from '../models/db';
import errors from './errors';

/**
 * @class AuthController
 */
class AuthController {
  /**
    * Register a user
    *@param {object} req The request *.
    *@param {object} res The response *.
    *@returns {object} returns response *
    */
  static signUp(req, res) {
    const {
      firstName, lastName, email, password
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const text = 'INSERT INTO users(first_name, last_name, email, password, role) values($1, $2, $3, $4, $5) RETURNING user_id';
    const parameters = [firstName, lastName, email, hashedPassword, 'user'];
    db.query(text, parameters, (err, user) => {
      if (err) return errors.serverError(res);
      return res.status(201).json({
        message: 'Account created successfully',
        data: {
          userId: user.rows[0].user_id,
          firstName,
          lastName,
          email,
          role: 'user'
        }
      });
    });
  }

  /**
    * Login a user
    *@param {*} req The request *.
    *@param {*} res The response *.
    *@returns {undefined} The return *
    */
  static login(req, res) {
    // extract token from req.locals
    const { token } = req;
    const { role } = req.userData;
    const d = new Date();
    return res.status(200).json({
      message: 'Log in successfull',
      data: {
        token,
        role,
        createdAt: d,
        expiresIn: '6hrs'
      }
    });
  }
}

export default AuthController;
