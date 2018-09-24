import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

const validatePhone = Joi.extend(JoiPhoneNumber);

const foodItemObj = Joi.object().keys({
  foodId: Joi.number().positive().required(),
  quantity: Joi.number().positive().min(1).max(100)
    .required(),
}).required();


const Schema = {
  placeOrderSchema: {
    phoneNo: validatePhone.string().phoneNumber().min(11).max(13)
      .required(),
    address: Joi.string().min(7).max(50).required(),
    foodItems: Joi.array().items(foodItemObj).required(),
  },
  updateStatusSchema: {
    orderId: Joi.number().positive().required(),
    status: Joi.string().valid('Pending Approval', 'Complete', 'Accept', 'Decline').required()
  },
  authSchema: {
    firstName: Joi.string().alphanum().min(3).max(15)
      .required(),
    lastName: Joi.string().alphanum().min(3).max(15)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(10).required()
  },

  mealSchema: {
    foodName: Joi.string().min(3).max(30)
      .required(),
    price: Joi.number().positive().required(),
    category: Joi.string().min(8).max(15).required(),
    imageUrl: Joi.string().uri().min(11)
      .required()
  },
};

export default Schema;
