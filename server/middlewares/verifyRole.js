import errors from '../controllers/errors';

const admin = (req, res, next) => {
  const { role } = req.userData;
  if (!(role === 'admin')) {
    return errors.unauthorizedError(res);
  }
  next();
};


export default { admin };

