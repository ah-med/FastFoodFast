import errors from '../controllers/errors';

const verifyRole = (req, res, next, validRole) => {
  const { role } = req.userData;
  if (!(role === validRole)) {
    return errors.unauthorizedError(res);
  }
  next();
};

const admin = (req, res, next) => verifyRole(req, res, next, 'admin');

const user = (req, res, next) => verifyRole(req, res, next, 'user');

export default { admin, user };
