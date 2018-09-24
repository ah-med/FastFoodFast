import Schema from './validationSchema';
import Validator from './validator';
import Errors from '../controllers/errors';

const { mealSchema } = Schema;
const { validationError } = Errors;


const validateMeal = (req, res, next) => {
  const data = ['foodName', 'price', 'imageUrl', 'category'];
  const errors = Validator(data, req.body, mealSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};


export default validateMeal;
