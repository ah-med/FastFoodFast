import Joi from 'joi';

const foodItemObj = Joi.object().keys({
  foodId: Joi.number().positive().required(),
  quantity: Joi.number().positive().min(1).max(100)
    .required(),
}).required();

const textRegex = /^[a-zA-Z]+$/i;
const textSpaceRegex = /^[a-zA-Z ]+$/i;

const nameObject = name => ({
  name,
});

const Schema = {
  placeOrderSchema: {
    phoneNo: Joi.number().integer().positive().required(),
    address: Joi.string().min(7).max(50).required(),
    foodItems: Joi.array().items(foodItemObj).required(),
  },
  updateStatusSchema: {
    status: Joi.string().valid('Complete', 'Process', 'Cancel').required()
  },
  idSchema: {
    id: Joi.number().integer().positive().required()
  },
  authSchema: {
    firstName: Joi.string().regex(textRegex, nameObject('a-z and A-Z without space')).min(3).max(25)
      .required(),
    lastName: Joi.string().regex(textRegex, nameObject('a-z and A-Z without space')).min(3).max(25)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  },
  mealSchema: {
    foodName: Joi.string().regex(textSpaceRegex, nameObject('a-z and A-Z')).min(3).max(25)
      .required(),
    price: Joi.number().positive().max(999999).required(),
    category: Joi.string().regex(textSpaceRegex, nameObject('a-z and A-Z')).min(3).max(25)
      .required(),
    imageUrl: Joi.string().uri().min(11)
      .required()
  },
};

export default Schema;
