// this is a component that will take as props the number of tables for the specific restaurant and render table components for each table

import React from 'react';
import Image from 'next/image';
import Table from './table';
import Delivered from './delivered.js';
import Paid from './paid.js';
import ConnectionStatus from './connectionStatus.js';
import OrderItem from './orderItem.js';

export default function Orders({ tables, orders, isConnected }) {
  const [switchView, setSwitchView] = React.useState(false);

  function toggleSwitchView() {
    setSwitchView(!switchView);
  }

  function getColorForTable(orders, table) {
    let hasUndelivered = false;
    let hasUnpaid = false;
    let hasOrders = false;
    if (!orders) return 'bg-gray-200';
    orders.forEach((order) => {
      if (order.table_id === table) {
        hasOrders = true;
        if (!order.delivered) {
          hasUndelivered = true;
        }
        if (!order.paid) {
          hasUnpaid = true;
        }
      }
    });

    if (!hasOrders) {
      return 'bg-gray-200';
    }
    if (hasUndelivered) {
      return 'bg-red-200';
    }
    if (hasUnpaid) {
      return 'bg-yellow-200';
    }
    return 'bg-green-200';
  }

  return (
    <>
      {orders && (
        <div className="flex flex-row absolute top-0 right-0 max-h-16 overflow-hidden bg-sky-300 shadow rounded-bl-md">
          <button
            className="rounded bg-sky-500 hover:bg-sky-600 text-xs m-2 p-2 text-white"
            onClick={toggleSwitchView}
          >
            Cambia visuale
          </button>
          <Delivered orders={orders} />
          <Paid orders={orders} />
          <ConnectionStatus status={isConnected} />
        </div>
      )}
      <div className="flex flex-row flex-wrap p-20 h-full overflow-hidden overflow-y-auto">
        {!switchView ? (
          tables &&
          tables.map((table) => {
            // go through the orders and check if there are orders for the specific table, if yes we pass a color to the table component
            const color = getColorForTable(orders, table);
            if (!orders)
              return <Table key={table} table={table} color={color} />;
            return <Table key={table} table={table} color={color} />;
          })
        ) : (
          <>
            {orders &&
              orders.map((order) => {
                return (
                  <div className="bg-sky-300 w-full flex flex-row p-4 mb-4 rounded-md min-h-28 shadow">
                    <div className="p-4 flex flex-row items-center aspect-square h-14 justify-center bg-sky-200 rounded-md shadow mr-4">
                      <Image
                        src="https://www.svgrepo.com/show/490390/table.svg"
                        alt="table"
                        width={15}
                        height={15}
                      />
                      <div className="ml-2 font-semibold text-lg">
                        {order.table_id}
                      </div>
                    </div>
                    <OrderItem key={order._id} order={order} />
                  </div>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}
