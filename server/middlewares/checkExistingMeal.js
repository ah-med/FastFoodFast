import db from '../models/db';
import errors from '../controllers/errors';

const checkExistingMeal = (req, res, next) => {
  const foodName = req.body.foodName.toLowerCase();

  const text = '(select food_name from menu)';

  db.query(text, (err, food) => {
    if (err) errors.serverError(res);
    const findName = food.rows.find(val => val.food_name.toLowerCase() === foodName);
    if (findName) {
      return res.status(409).json({
        error: {
          status: 409,
          title: 'MEAL_AREADY_EXISTS',
          description: 'the meal you want to add already exists'
        }
      });
    }
    next();
  });
};

export default checkExistingMeal;
