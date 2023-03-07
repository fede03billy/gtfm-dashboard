import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Navbar from '../components/navbar';
import Orders from '../components/order';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import hider from 'simple-hider';
import { Dialog } from '@headlessui/react';
import { usePopup, usePopupUpdate } from '../components/popupContext';

export default function Home() {
  const router = useRouter();
  const [selection, setSelection] = useState('ORDINI');
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const isOpen = usePopup(); // this one starts at undefined instead of false
  const togglePopup = usePopupUpdate(); // this one is a function that will toggle the isOpen state
  const [table, setTable] = useState(null); // This one is to turn into a context to let the table component have a button to open the modal and to let the modal know which table it has been opened for
  const [orders, setOrders] = useState(null); // Array of orders that must be updated in real time. The data structure will be decided later but something like this is to be expected: {_id, table_id, ordered_food: Array of simplified food objects, total_price, paid, done }

  async function getOrders() {
    // call api to get the orders for the specific restaurant
    if (!restaurantInfo) return;
    await fetch(`/api/order/${restaurantInfo._id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setOrders(data);
          return data;
        });
      } else {
        console.error('error');
      }
    });
  }

  useEffect(() => {
    // check if there's a token called gtfm_token in the cookies
    // if there is, render the dashboard
    // if there isn't, render the login page
    if (
      typeof window !== 'undefined' &&
      document.cookie.includes('gtfm_token')
    ) {
      //save the token in a variable, unhide it and parse it to JSON
      let gtfm_token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('gtfm_token'))
        .split('=')[1];
      setRestaurantInfo(JSON.parse(hider.unhide('precauzione', gtfm_token)));
      // all of this logic is in the useEffect cause it needs to be executed after the page is on the client and the window & document objects are available
      // TODO: implement a fallback for when the data is not properly formatted or some info is missing
    } else {
      console.error('token not found');
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (!restaurantInfo) return;
    // call api to get the orders for the specific restaurant
    getOrders();
  }, [restaurantInfo, orders]);

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
            <Orders tables={restaurantInfo.tables}></Orders>
          )}
          {selection === 'MENU' && <div>MENU</div>}
          {selection === 'PAGAMENTI' && <div>LINK AI PAGAMENTI STRIPE</div>}
          {selection === 'SETTINGS' && <div>IMPOSTAZIE</div>}
        </div>
        <Dialog
          open={isOpen}
          onClose={() => togglePopup()}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/[0.4]">
            <Dialog.Panel className="w-full max-w-sm rounded bg-gray-200 p-4">
              <Dialog.Title>Ordine del tavolo</Dialog.Title>
              <Dialog.Description>Ecco l'ordine del tavolo</Dialog.Description>

              <p>CIBO</p>
              {orders &&
                orders.map((order, i) => {
                  return (
                    <div key={i}>
                      <p key={i}>{order.ordered_food}</p>
                    </div>
                  );
                })}

              <button
                onClick={() => togglePopup()}
                className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
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
