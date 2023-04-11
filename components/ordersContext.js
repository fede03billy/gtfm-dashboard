import { createContext, useContext, useState } from 'react';

const OrdersContext = createContext();
const OrdersUpdateContext = createContext();

export function useOrders() {
  return useContext(OrdersContext);
}

export function useOrdersUpdate() {
  return useContext(OrdersUpdateContext);
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  async function mainRefreshOrders(restaurant_id) {
    console.info('Sto recuperando gli ordini...');
    console.time('Ordini recuperati con successo.');
    await fetch(`/api/order/${restaurant_id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setOrders(data);
          console.info('Ordini recuperati con successo.');
          console.timeEnd('Ordini recuperati con successo.');
          return data;
        });
      } else {
        console.error('error');
      }
    });
  }

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // I'm using a debounce function to avoid multiple calls to the api due to the socket events
  const refreshOrders = debounce(mainRefreshOrders, 5000);

  function updateOrder(order_id, parameter) {
    const updatedOrders = orders.map((order) => {
      if (order._id === order_id) {
        order[parameter] = true;
      }
      return order;
    });
    setOrders(updatedOrders);
  }

  function completeOrder(order_id) {
    const updatedOrders = orders.filter((order) => order._id !== order_id);
    setOrders(updatedOrders);
  }

  return (
    <OrdersContext.Provider value={orders}>
      <OrdersUpdateContext.Provider
        value={{ updateOrder, refreshOrders, completeOrder }}
      >
        {children}
      </OrdersUpdateContext.Provider>
    </OrdersContext.Provider>
  );
}
