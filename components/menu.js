import React, { useEffect } from 'react';

export default function Menu({ restaurant_id }) {
  const [menu, setMenu] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  function deleteItem(id) {
    fetch(`/api/restaurant/menu/delete/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setMenu(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }

  useEffect(() => {
    fetch(`/api/restaurant/menu/${restaurant_id}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setMenu(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [restaurant_id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menu &&
          menu.map((item) => (
            <li key={item._id}>
              {item.name} - {item.price}€
              <button onClick={() => deleteItem(item._id)}>Elimina</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
