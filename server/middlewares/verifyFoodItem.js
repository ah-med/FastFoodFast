import db from '../models/db';
import errors from '../controllers/errors';


const verifyFoodItem = (req, res, next) => {
  // get foodItems from requests
  let { foodItems } = req.body;

  foodItems = (typeof foodItems === 'string') ? JSON.parse(foodItems) : foodItems;
  db.query('select food_id from menu', (err, data) => {
    if (err) return errors.serverError(res);
    const dbFoodItems = data.rows;
    const errorArray = [];
    foodItems.forEach((element) => {
      const findItem = dbFoodItems.find(val => element.foodId === val.food_id);
      if (findItem === undefined) {
        errorArray.push({
          message: 'the food item does not exist',
          foodId: element.foodId
        });
      }
    });
    if (errorArray.length > 0) {
      return errors.forbidden(res, errorArray);
    }
    next();
  });
};

export default verifyFoodItem;
