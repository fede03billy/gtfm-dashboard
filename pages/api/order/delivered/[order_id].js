// route to mark order as delivered given the order id

import Order from '../../../../models/order';
import databaseConnection from '../../../../util/databaseConnection';

databaseConnection();

export default async function handler(req, res) {
  try {
    const { order_id } = req.query;

    await Order.findByIdAndUpdate(order_id, {
      delivered: true,
    });

    res.status(200).json({
      message: 'Ordini segnati come consegnati.',
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
}
