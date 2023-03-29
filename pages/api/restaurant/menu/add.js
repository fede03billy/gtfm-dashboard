// get the food in the body of the request and save it in the database

import Food from '../../../../models/food.js';

export default async (req, res) => {
  const { food } = req.body;
  if (!food) {
    res.status(400).json({ error: 'No food provided' });
    return;
  }
  const newFood = new Food({
    name: food.name,
    price: food.price,
    restaurant_id: food.restaurant_id,
    vegan: food.vegan,
    gluten_free: food.gluten_free,
    lactose_free: food.lactose_free,
    spicy: food.spicy,
  });
  await newFood
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
