import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

const validatePhone = Joi.extend(JoiPhoneNumber);

const foodItemObj = Joi.object().keys({
  itemId: Joi.number().positive().required(),
  quantity: Joi.number().positive().min(1).max(100)
    .required(),
}).required();

const Schema = {
  placeOrderSchema: {
    name: Joi.string().min(4).max(20).required(),
    phoneNo: validatePhone.string().phoneNumber().min(11).max(13)
      .required(),
    address: Joi.string().min(7).max(50).required(),
    foodItems: Joi.array().items(foodItemObj).required(),
  },
  updateStatusSchema: {
    orderId: Joi.number().positive().required(),
    status: Joi.string().valid('Pending Approval', 'Complete', 'Accept', 'Decline').required()
  },
};

export default Schema;
