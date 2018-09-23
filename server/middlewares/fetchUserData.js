import db from '../models/db';
import errors from '../controllers/errors';


const fetchUserData = (req, res, next) => {
  // extract email from req.body
  const { email } = req.body;

  // fetch all data of user from DB
  db.query('select * from users where email =$1', [email], (err, data) => {
    if (err) return errors.serverError(res);
    if (data.rows[0] === undefined) return errors.errorNotFound(res);
    const userData = data.rows[0];
    req.userData = userData;
    next();
  });
};

export default fetchUserData;
