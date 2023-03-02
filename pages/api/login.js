import hider from 'simple-hider';
import Restaurant from '../../models/restaurant';
import databaseConnection from '../../util/databaseConnection';

databaseConnection();

export default async function handler(req, res) {
  const { email, password } = req.body;

  // decypher password
  const clearPassword = hider.unhide('precauzione', password);
  // check if email and password match
  const restaurantInfo = await Restaurant.findOne({ owner_mail: email });

  if (restaurantInfo && restaurantInfo.password === clearPassword) {
    // if they do, return a token
    // generate the token stringyfing the restaurantInfo object and cyphering it with
    let gtfm_token = hider.hide('precauzione', JSON.stringify(restaurantInfo));
    res.status(200).json({ gtfm_token });
  } else {
    // if they don't, return an error
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
