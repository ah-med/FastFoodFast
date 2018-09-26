import errors from '../controllers/errors';

const verifyUserId = (req, res, next) => {
  if (req.params.userId !== req.userData.userId.toString()) {
    return errors.unauthorizedError(res);
  }
  next();
};

export default verifyUserId;
