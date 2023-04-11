// component to display the order item
//
// Path: components/orderItem.js

import normalizeFood from '../util/normalizeFood';
import { useOrdersUpdate } from './ordersContext';

export default function OrderItem({ order }) {
  const ordered_food = order.ordered_food;
  const total_price = order.total_price;
  const paid = order.paid;
  const order_id = order._id;
  const note = order.note;
  const { updateOrder, completeOrder } = useOrdersUpdate();

  async function deliveredOrder() {
    const res = await fetch(`/api/order/delivered/${order_id}`);
    const data = await res.json();
    if (data.success) {
      updateOrder(order_id, 'delivered');
      console.info('Ordine contrassegnato come consegnato.');
    }
  }

  async function paidOrder() {
    const res = await fetch(`/api/order/paid/${order_id}`);
    const data = await res.json();
    if (data.success) {
      updateOrder(order_id, 'paid');
      console.info('Ordine contrassegnato come pagato.');
    }
  }

  async function completedOrder() {
    const res = await fetch(`/api/order/done/${order_id}`);
    const data = await res.json();
    if (data.success) {
      updateOrder(order_id, 'done');
      completeOrder(order_id);
      console.info('Ordine contrassegnato come completato.');
    }
  }

  // function to modify the ordered food array to add the quantity of each item and removing the duplicates
  function prepareOrder(ordered_food) {
    const modifiedList = [];
    ordered_food.forEach((item) => {
      item = normalizeFood(item);
      const index = modifiedList.findIndex(
        (cartItem) => cartItem._id === item?._id
      );
      if (index === -1) {
        modifiedList.push({ ...item, quantity: 1 });
      } else {
        modifiedList[index].quantity++;
      }
    });
    return modifiedList;
  }

  const modifiedList = prepareOrder(ordered_food);

  return (
    <div className="flex flex-col w-full bg-white rounded-md shadow-md my-2">
      <div className="flex flex-row justify-between p-5 w-full">
        <div className="timestamp max-h-20 aspect-square">
          {new Date(order.created_at).toLocaleString()}
        </div>
        <div className="flex flex-col">
          {ordered_food &&
            modifiedList &&
            modifiedList.map((food, i) => {
              // food = normalizeFood(food);
              return (
                <div key={i} className="flex flex-col justify-between">
                  {food?.name} - {food?.quantity} - €{' '}
                  {((food?.quantity * food?.price) / 100).toFixed(2)}
                </div>
              );
            })}
          <div className="note">
            {note && <div className="text-black opacity-30">Note: {note}</div>}
          </div>
        </div>
        <div className="text-lg font-bold">
          € {(total_price / 100).toFixed(2)}
        </div>
        <div className="status text-sm text-gray-500">
          {order.delivered
            ? paid
              ? 'Pagato'
              : 'Non pagato'
            : 'Non consegnato'}
          {/* TODO: change the text status with a colored dot */}
        </div>
        <div className="flex gap-4 justify-center">
          {/* TODO: disabled button do not have a style, they just don't work and that's fine, but it might be cool to give them some opacity or similar solutions */}
          <button
            onClick={deliveredOrder}
            disabled={order.delivered}
            className="w-xs max-w-xs text-sm text-gray-100 rounded-md bg-slate-500 py-2 px-4 aspect-square max-h-20"
          >
            Segna come consegnato
          </button>
          <button
            onClick={paidOrder}
            disabled={paid}
            className="w-xs max-h-xs max-w-xs text-sm text-gray-100 rounded-md bg-slate-500 py-2 px-4 aspect-square max-h-20"
          >
            Segna come pagato
          </button>
          <button
            onClick={completedOrder}
            className="w-xs max-w-xs text-sm text-gray-100 rounded-md bg-slate-500 py-2 px-4 aspect-square max-h-20"
          >
            Segna come completato
          </button>
        </div>
      </div>
    </div>
  );
}
