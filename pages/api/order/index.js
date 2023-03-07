// this should be the api route for '/api/order'
// it should be listening, via a websocket connection, to changes in the database
// and then send those changes to the client
import Order from '../../../models/order.js';
import databaseConnection from '../../../util/databaseConnection';
import { Server } from 'socket.io';

databaseConnection();

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    // listen to changes in the database
    Order.watch();
    // The following code is not needed cause the watch() method send changes events to the client automatically (or at least it seems like that)
    // .on('change', (data) => {
    //   // send the changes to the client
    //     io.emit('change', data);
    // });
  }
  res.end();
}
