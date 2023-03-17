// this is a component that will take as props the number of tables for the specific restaurant and render table components for each table

import React from 'react';
import Table from './table';

export default function Orders({ tables, orders }) {
  return (
    <div className="flex flex-row flex-wrap p-20 h-full">
      {tables.map((table) => {
        // go through the orders and check if there are orders for the specific table, if yes we pass a color to the table component
        let color = 'bg-gray-200';
        orders.forEach((order) => {
          if (order.table_id === table && order.paid === false) {
            color = 'bg-green-200';
          }
        });
        return <Table key={table} table={table} color={color} />;
      })}
    </div>
  );
}
