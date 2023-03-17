// this is a component that will take as props the number of tables for the specific restaurant and render table components for each table

import React from 'react';
import Table from './table';

export default function Orders({ tables, orders }) {
  function getColorForTable(orders, table) {
    let hasUndelivered = false;
    let hasUnpaid = false;
    let hasOrders = false;

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
      return 'bg-yellow-200';
    }
    if (hasUnpaid) {
      return 'bg-red-200';
    }
    return 'bg-green-200';
  }

  return (
    <div className="flex flex-row flex-wrap p-20 h-full">
      {tables.map((table) => {
        // go through the orders and check if there are orders for the specific table, if yes we pass a color to the table component
        if (!orders) return <Table key={table} table={table} color={color} />;
        const color = getColorForTable(orders, table);
        return <Table key={table} table={table} color={color} />;
      })}
    </div>
  );
}
