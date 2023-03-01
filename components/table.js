// table component, this one will show the order for the specific table

// import React from 'react';
// import { getOrders } from '../api';
//
export default function Table({ table }) {
  //   const { data, isLoading, isError } = useQuery(
  //     ['orders', table.id],
  //     () => getOrders(table.id),
  //     { refetchOnWindowFocus: false }
  //   );
  //
  //   if (isLoading) return <div>Loading...</div>;
  //   if (isError) return <div>Error</div>;
  //
  return <div>{table}</div>;
}
