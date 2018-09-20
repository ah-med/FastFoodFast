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
      itemName, quantity, price, imageUrl, category
    } = req.body;

    const text = 'INSERT INTO menu(item_name, quantity, price, image_url, category) values($1, $2, $3, $4, $5) RETURNING food_id, no_of_times_ordered';
    const param = [itemName, quantity, price, imageUrl, category];
    db.query(text, param, (err, menu) => {
      if (err) return errors.serverError(res);
      return res.status(201).json({
        message: 'Menu added successfully',
        data: [
          {
            foodId: menu.rows[0].food_id,
            timesOrdered: menu.rows[0].no_of_times_ordered,
            itemName,
            quantity,
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
