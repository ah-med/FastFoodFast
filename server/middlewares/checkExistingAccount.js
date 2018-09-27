import db from '../models/db';
import errors from '../controllers/errors';

const checkExistingAccount = (req, res, next) => {
  const { email } = req.body;

  const text = 'select exists(select user_id from users where email=$1)';

  db.query(text, [email], (err, user) => {
    if (err) return errors.serverError(res);
    if (user.rows[0].exists) {
      return errors.confictError(res, 'An account with the provided email already exist');
    }
    next();
  });
};

export default checkExistingAccount;
