// component to display the order item
//
// Path: components/orderItem.js

import normalizeFood from '../util/normalizeFood';
import Image from 'next/image';
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
    <div className="flex flex-col w-full bg-sky-100 rounded-md shadow-md">
      <div className="flex flex-row justify-between p-5 w-full">
        <div
          className="timestamp max-h-14 aspect-square text-black text-opacity-30"
          title={new Date(order.created_at).toLocaleString()}
        >
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </div>
        <div className="flex flex-col">
          {ordered_food &&
            modifiedList &&
            modifiedList.map((food, i) => {
              // food = normalizeFood(food);
              return (
                <div key={i} className="flex flex-col justify-between">
                  <div className="inline-block">
                    {food?.name}
                    <span className="text-lg text-black text-opacity-30 ml-2">
                      x{food?.quantity}
                    </span>
                  </div>
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
          {order.delivered ? (
            paid ? (
              <div className="rounded-full bg-green-200 py-1 px-2 text-xs">
                Completo
              </div>
            ) : (
              <div className="rounded-full bg-yellow-200 py-1 px-2 text-xs">
                Da pagare
              </div>
            )
          ) : (
            <div className="rounded-full bg-red-200 py-1 px-2 text-xs">
              Da consegnare
            </div>
          )}
          {/* TODO: change the text status with a colored dot */}
        </div>
        <div className="flex gap-4 justify-center">
          {/* TODO: disabled button do not have a style, they just don't work and that's fine, but it might be cool to give them some opacity or similar solutions */}
          <button
            onClick={deliveredOrder}
            disabled={order.delivered}
            className="w-14 rounded-md bg-sky-200 py-2 px-4 aspect-square h-14"
          >
            <Image
              src="https://www.svgrepo.com/show/482320/room-service-1.svg"
              width={25}
              height={25}
              alt="Segna l'ordine come consegnato al tavolo"
              title="Segna l'ordine come consegnato al tavolo"
            />
          </button>
          <button
            onClick={paidOrder}
            disabled={paid}
            className="w-14 rounded-md bg-sky-200 py-2 px-4 aspect-square h-14"
          >
            <Image
              src="https://www.svgrepo.com/show/390121/creadit-card-debit-hand-pay.svg"
              width={25}
              height={25}
              alt="Segna l'ordine come pagato"
              title="Segna l'ordine come pagato"
            />
          </button>
          <button
            onClick={completedOrder}
            className="w-14 rounded-md bg-sky-200 py-2 px-4 aspect-square h-14"
          >
            <Image
              src="https://www.svgrepo.com/show/362783/hand-waving-bold.svg"
              width={25}
              height={25}
              alt="Segna l'ordine come completato e libera il tavolo"
              title="Segna l'ordine come completato e libera il tavolo"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
