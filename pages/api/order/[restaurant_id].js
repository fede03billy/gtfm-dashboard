// API route to retrieve all the orders (not done yet) of a specific restaurant

// Path: pages/api/order/[restaurant_id].js

import Order from '../../../models/order';
import Food from '../../../models/food';
import databaseConnection from '../../../util/databaseConnection';

databaseConnection();

export default async function handler(req, res) {
  const {
    query: { restaurant_id },
  } = req;

  const orders = await Order.find({
    restaurant_id: restaurant_id,
    done: false,
  });

  async function getFoodList(orderedFood) {
    let foodList = [];
    for (let i = 0; i < orderedFood.length; i++) {
      await Food.findById(orderedFood[i], { name: 1, price: 1 }).then(
        (food) => {
          // INFO: the food returned by this query is not formatted as a JSON
          // and the property are not accessible with the dot notation
          // once in on the client side, we use the normalizeFood function to format the food object
          // and access its properties to be displayed in the UI
          foodList.push(food);
        }
      );
    }
    return foodList;
  }
  // swap the orders.ordered_food array with the foodList array for each order, where the foodList array contains the complete food objects
  for (let i = 0; i < orders.length; i++) {
    orders[i].ordered_food = await getFoodList(orders[i].ordered_food);
  }

  res.json(orders);
}
