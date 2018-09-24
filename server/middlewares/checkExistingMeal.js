import db from '../models/db';
import errors from '../controllers/errors';

const checkExistingMeal = (req, res, next) => {
  const itemName = req.body.itemName.toLowerCase();

  const text = '(select food_name from menu)';

  db.query(text, (err, foodName) => {
    if (err) errors.serverError(res);
    const findName = foodName.rows.find(val => val.food_name.toLowerCase() === itemName);
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
