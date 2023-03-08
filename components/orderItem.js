// component to display the order item
//
// Path: components/orderItem.js

import normalizeFood from '../util/normalizeFood';

export default function OrderItem({
  ordered_food,
  total_price,
  paid,
  order_id,
}) {
  async function paidOrder() {
    const res = await fetch(`/api/order/paid/${order_id}`);
    const data = await res.json();
    if (data.success) {
      console.info('Ordine contrassegnato come pagato.');
    }
  }

  async function completedOrder() {
    const res = await fetch(`/api/order/done/${order_id}`);
    const data = await res.json();
    if (data.success) {
      console.info('Ordine contrassegnato come completato.');
    }
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-md shadow-md">
      <div className="flex flex-col justify-between p-5">
        {ordered_food &&
          ordered_food.map((food, i) => {
            food = normalizeFood(food);
            return (
              <div key={i} className="flex flex-col justify-between">
                {food?.name} - € {(food?.price / 100).toFixed(2)}
              </div>
            );
          })}
        <div className="flex flex-col">
          <div className="text-lg font-bold">
            € {(total_price / 100).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {paid ? 'Pagato' : 'Non pagato'}
          </div>
          <button
            onClick={paidOrder}
            className="text-sm text-gray-100 rounded-md bg-slate-500 py-2 px-4"
          >
            Segna come pagato
          </button>
          <button
            onClick={completedOrder}
            className="text-sm text-gray-100 rounded-md bg-slate-500 py-2 px-4"
          >
            Segna come completato
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between p-5">
        <div className="flex flex-col"></div>
      </div>
    </div>
  );
}
