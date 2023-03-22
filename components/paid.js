// component to show the number of paid orders over the total

export default function Paid({ orders }) {
  const totalOrders = orders.length;
  let paidOrders = 0;
  orders.forEach((order) => {
    if (order.paid) {
      paidOrders++;
    }
  });
  return (
    <div className="flex justify-center items-center p-2 border text-xs">
      Pagati: {paidOrders}/{totalOrders}
    </div>
  );
}
