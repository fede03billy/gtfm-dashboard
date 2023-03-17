// this is a component that will take as props the number of tables for the specific restaurant and render table components for each table

import React from 'react';
import Table from './table';

export default function Orders({ tables }) {
  return (
    <div className="flex flex-row flex-wrap p-20 h-full">
      {tables.map((table) => (
        <Table key={table} table={table} />
      ))}
    </div>
  );
}
