// this is a component that will take as props the number of tables for the specific restaurant and render table components for each table

import React from 'react';
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
        <div className="flex flex-row absolute top-0 right-0 max-h-16 overflow-hidden">
          <button
            className="rounded bg-gray-500 text-xs m-2 p-2 text-white"
            onClick={toggleSwitchView}
          >
            Cambia visuale
          </button>
          <Delivered orders={orders} />
          <Paid orders={orders} />
          <ConnectionStatus status={isConnected} />
        </div>
      )}
      <div className="flex flex-row flex-wrap p-20 h-full">
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
                  <>
                    <div>{order.table_id}</div>
                    <OrderItem key={order._id} order={order} />
                  </>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}
