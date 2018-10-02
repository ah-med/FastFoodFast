import Schema from './validationSchema';
import Validator from './validator';

const { getValidation } = Validator;
const { mealSchema } = Schema;

const validateMeal = (req, res, next) => getValidation(req, res, next, ['foodName', 'price', 'imageUrl', 'category'], mealSchema);

export default validateMeal;
