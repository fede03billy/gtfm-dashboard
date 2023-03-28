// route to get the restaurant menu from the food database

import Food from '../../../../models/food.js';

export default async (req, res) => {
  const { restaurant_id } = req.query;
  const menu = await Food.find({ restaurant_id });
  console.log(restaurant_id);
  res.json(menu);
};
