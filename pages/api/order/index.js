// this should be the api route for '/api/order'
// it should be listening, via a websocket connection, to changes in the database
// and then send those changes to the client
import Order from '../../../models/order.js';
import databaseConnection from '../../../util/databaseConnection';
import { Server } from 'socket.io';

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    try {
      await databaseConnection();
      console.log('Socket is initializing');
      const io = new Server(res.socket.server);
      res.socket.server.io = io;
      io.on('connection', (socket) => {
        console.log('Client connected');
        console.info('Socket ID: ', socket.id);
        // listen to changes in the database
        Order.watch().on('change', (data) => {
          console.log('Evento registrato: ', data.operationType);
          // send the changes to the client
          io.emit('change', data);
        });
        socket.on('event-received', () =>
          console.log('Evento ricevuto dalla Dashboard.')
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
  res.end();
}
