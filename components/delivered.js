// component to show the number of delivered orders over the total number of orders for the specific restaurant

export default function Delivered({ orders }) {
  const totalOrders = orders.length;
  let deliveredOrders = 0;
  orders.forEach((order) => {
    if (order.delivered) {
      deliveredOrders++;
    }
  });
  return (
    <div className="flex justify-center items-center p-2 border text-xs">
      Consegnati: {deliveredOrders}/{totalOrders}
    </div>
  );
}
