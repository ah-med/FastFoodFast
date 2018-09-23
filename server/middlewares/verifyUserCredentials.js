import bcrypt from 'bcryptjs';
import errors from '../controllers/errors';


const verifyUserCredentials = (req, res, next) => {
  const { password } = req.body;

  const match = bcrypt.compareSync(password.trim(), req.userData.password);
  if (!match) return errors.wrongPassword(res);
  next();
};

export default verifyUserCredentials;
