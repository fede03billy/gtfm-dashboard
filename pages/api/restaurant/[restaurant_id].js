// route to gather the restaurant document from the id

import Restaurant from '../../../models/restaurant';
import databaseConnection from '../../../util/databaseConnection';

export default async function handler(req, res) {
  const { restaurant_id } = req.query;
  try {
    await databaseConnection();
    const restaurant = await Restaurant.findById(restaurant_id);
    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
