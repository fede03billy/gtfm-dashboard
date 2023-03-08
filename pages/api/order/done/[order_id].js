// route to mark order as done given the order id
//
// Path: pages/api/order/done.js

import Order from '../../../../models/order';
import databaseConnection from '../../../../util/databaseConnection';

databaseConnection();

export default async function handler(req, res) {
  try {
    const { order_id } = req.query;

    await Order.findByIdAndUpdate(order_id, {
      done: true,
    });

    res.status(200).json({
      message: 'Ordini segnati come completati.',
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
}
