import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Navbar from '../components/navbar';
import ConnectionStatus from '../components/connectionStatus';
import Orders from '../components/order';
import OrderItem from '../components/orderItem.js';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import hider from 'simple-hider';
import { Dialog } from '@headlessui/react';
import { usePopup, usePopupUpdate } from '../components/popupContext';
import { useTable } from '../components/popupContext';
import { io } from 'socket.io-client';
import { getCookie, hasCookie } from 'cookies-next'; // does this work only on node 18?

export default function Home() {
  const router = useRouter();
  const [selection, setSelection] = useState('ORDINI'); // handles the navbar menu selection
  const [restaurantInfo, setRestaurantInfo] = useState(null); // this state holds the restaurant info
  const isOpen = usePopup(); // this one starts at undefined instead of false
  const togglePopup = usePopupUpdate(); // this one is a function that will toggle the isOpen state
  const table = useTable();
  const [orders, setOrders] = useState(null); // Array of orders that must be updated in real time.
  const [isConnected, setIsConnected] = useState(false); // this state will be used to show the ws connection status
  let socket;

  async function getOrders() {
    // call api to get the orders for the specific restaurant
    if (!restaurantInfo) return;
    console.info('Sto recuperando gli ordini...');
    await fetch(`/api/order/${restaurantInfo._id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setOrders(data);
          console.info('Ordini recuperati con successo.');
          return data;
        });
      } else {
        console.error('error');
      }
    });
  }

  const socketInitializer = async () => {
    // connect to the socket
    await fetch('/api/order');
    socket = io();
    socket.on('connect', () => {
      console.info('Connessione al server real-time effettuata.');
      console.info('Socket ID: ', socket.id);
      console.info('Restaurant ID: ', restaurantInfo?._id);
      setIsConnected(true);
      socket.on('change', (data) => {
        // console.log('Evento registrato: ', data.operationType);
        getOrders();
        socket.emit('event-received');
      });
      socket.on('reconnect_attempt', () => {
        console.info('Riconnessione al server real-time in corso...');
      });
      socket.on('reconnect', () => {
        console.info('Riconnessione al server real-time effettuata.');
      });
      socket.on('disconnect', () => {
        setIsConnected(false);
        console.info('Connessione al server real-time persa.');
      });
    });
  };

  async function retrieveRestaurantInfo(restaurant_id) {
    // remove the quotes from the restaurant_id
    restaurant_id = restaurant_id.replace(/"/g, '');
    // call api to get the restaurant info
    console.info('Sto recuperando le informazioni del ristorante...');
    await fetch(`/api/restaurant/${restaurant_id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          const { restaurant } = data;
          setRestaurantInfo(restaurant);
          console.info('Informazioni del ristorante recuperate con successo.');
          return data;
        });
      } else {
        console.error('Errore nel recupero delle informazioni del ristorante.');
      }
    });
  }

  useEffect(() => {
    // check if there's a token called gtfm_token in the cookies
    // if there is, render the dashboard
    // if there isn't, render the login page
    if (typeof window !== 'undefined' && hasCookie('gtfm_token')) {
      //save the token in a variable, unhide it and parse it to JSON
      console.info('Recupero token di login in corso...');
      let gtfm_token = getCookie('gtfm_token');
      retrieveRestaurantInfo(hider.unhide('precauzione', gtfm_token));
      console.info('Token di login recuperato con successo.');
      // all of this logic is in the useEffect cause it needs to be executed after the page is on the client and the window & document objects are available
      // TODO: implement a fallback for when the data is not properly formatted or some info is missing
    } else {
      console.error('Effettuare il login per accedere alla dashboard.');
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    // this useEffect initialize the orders array once the restaurantInfo is available
    if (!restaurantInfo) return;
    // call api to get the orders for the specific restaurant
    getOrders();
    // initialize the socket
    socketInitializer();
  }, [restaurantInfo]);

  // useEffect(() => {
  //   // this useEffect will update (re-render) the orders array every time a new order is added
  //   console.log('Ordini aggiornati: ', orders);
  // }, [orders]);

  return (
    <>
      <Head>
        <title>GTFM - Dashboard</title>
        <meta name="description" content="GTFM  - Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="w-1/5 h-screen">
          <Navbar setter={setSelection}></Navbar>
        </div>
        <div className="w-5/6 h-screen">
          {selection === 'ORDINI' && restaurantInfo && (
            <Orders tables={restaurantInfo.tables} orders={orders}></Orders>
          )}
          {selection === 'MENU' && <div>MENU</div>}
          {selection === 'PAGAMENTI' && <div>LINK AI PAGAMENTI STRIPE</div>}
          {selection === 'SETTINGS' && <div>IMPOSTAZIE</div>}
        </div>
        {selection === 'ORDINI' && <ConnectionStatus status={isConnected} />}
        <Dialog
          open={isOpen}
          onClose={() => togglePopup()}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/[0.4]">
            <Dialog.Panel className="w-full max-w-4xl rounded bg-gray-200 p-4">
              <Dialog.Title>Ordine del tavolo {table}</Dialog.Title>
              <Dialog.Description>
                Ecco cosa è stato ordinato:
              </Dialog.Description>
              {orders &&
                orders.map((order, i) => {
                  if (order.table_id !== table) return;
                  return <OrderItem key={i} order={order} />;
                })}

              <button
                onClick={() => togglePopup()}
                className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1 w-full max-w-xs"
              >
                Chiudi
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </main>
    </>
  );
}
