import db from '../models/db';
import errors from '../controllers/errors';


const calculateAmount = (foodItems, priceList) => {
  let total = 0;
  foodItems.forEach((item) => {
    const itemPriceList = priceList.find(val => val.food_id === item.foodId);
    const { price } = itemPriceList;
    const subTotal = price * item.quantity;
    total += subTotal;
  });

  return total;
};


const getTotalAmount = (req, res, next) => {
  let { foodItems } = req.body;
  foodItems = (typeof foodItems === 'string') ? JSON.parse(foodItems) : foodItems;
  db.query('select price, food_id from menu', (error, data) => {
    if (error) return errors.serverError(res);
    const priceList = data.rows;
    const totalAmount = calculateAmount(foodItems, priceList);
    req.totalAmount = totalAmount;
    next();
  });
};

export default getTotalAmount;
