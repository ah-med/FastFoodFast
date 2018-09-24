import db from '../models/db';
import errors from './errors';

/**
 * @class MenuController
 */
class MenuController {
  /**
        * Add meal to a menu
        *@param {object} req The request *.
        *@param {object} res The response *.
        *@returns {object} returns response *
        */
  static addMeal(req, res) {
    const {
      foodName, price, imageUrl, category
    } = req.body;

    const text = 'INSERT INTO menu(food_name, price, image_url, category) values($1, $2, $3, $4) RETURNING food_id';
    const param = [foodName, price, imageUrl, category];
    db.query(text, param, (err, menu) => {
      if (err) return errors.serverError(res);
      return res.status(201).json({
        message: 'Menu added successfully',
        data: [
          {
            foodId: menu.rows[0].food_id,
            foodName,
            price,
            imageUrl,
            category
          }
        ]
      });
    });
  }
}

export default MenuController;
