// this should be the api route for '/api/order'
// it should be listening, via a websocket connection, to changes in the database
// and then send those changes to the client
import Order from '../../../models/order.js';
import databaseConnection from '../../../util/databaseConnection';
// import { Server } from 'socket.io';

databaseConnection();

export default async function handler(req, res) {
  // TODO: make this real time with the socket connection and not by continuos re-rendering
  //   if (res.socket.server.io) {
  //     console.log('Socket is already running');
  //   } else {
  //     console.log('Socket is initializing');
  //     const io = new Server(res.socket.server);
  //     res.socket.server.io = io;
  // listen to changes in the database
  Order.watch();

  // .on('change', (data) => {
  //   // send the changes to the client
  //   // io.emit('change', data);
  // });
  // }
  res.end();
}
