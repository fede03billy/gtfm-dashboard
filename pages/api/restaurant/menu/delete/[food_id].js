// route to delete a food from the food database give the id
import Food from '../../../../../models/food.js';

export default async (req, res) => {
  const { food_id } = req.query;
  await Food.deleteOne({ _id: food_id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
