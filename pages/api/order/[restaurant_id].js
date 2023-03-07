// API route to retrieve all the orders (not done yet) of a specific restaurant

// Path: pages/api/order/[restaurant_id].js

import Order from '../../../models/order';

export default async function handler(req, res) {
  const {
    query: { restaurant_id },
  } = req;

  const orders = await Order.find({
    restaurant_id: restaurant_id,
    done: false,
  });

  // TODO: we should also parse the ordered_food array to get the food name from the food table and add it to the response

  res.json(orders);
}
