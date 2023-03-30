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
  }, [menu]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4">
      <h1 className="mb-4">Menu</h1>
      <ul>
        {menu.length &&
          menu.map((item) => (
            <li
              className="bg-gray-200 rounded p-4 w-fit shadow-sm mb-4"
              key={item._id}
            >
              {item.name} - {(item.price / 100).toFixed(2)}€
              <button
                className="border rounded border-gray-900 hover:bg-gray-300 py-2 px-4 ml-4"
                onClick={() => deleteItem(item._id)}
              >
                Elimina
              </button>
            </li>
          ))}
      </ul>
      <div className="max-w-2xl bg-gray-200 rounded shadow-sm p-4">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const price = e.target.price.value;
            const description = e.target.description.value;
            const category = e.target.category.value;
            const vegan = e.target.vegan.checked;
            const gluten_free = e.target.gluten_free.checked;
            const lactose_free = e.target.lactose_free.checked;
            const spicy = e.target.spicy.checked;
            const food = {
              name,
              price,
              description,
              category,
              restaurant_id,
              vegan,
              gluten_free,
              lactose_free,
              spicy,
            };
            fetch('/api/restaurant/menu/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ food }),
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
          }}
        >
          <label htmlFor="name">Nome</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="text"
            name="name"
            id="name"
          />
          <label htmlFor="price">Prezzo</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="number"
            name="price"
            id="price"
          />
          <label htmlFor="description">Descrizione</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="text"
            name="description"
            id="description"
          />
          <label htmlFor="category">Categoria</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="text"
            name="category"
            id="category"
          />
          <label htmlFor="vegan">Vegano</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="checkbox"
            name="vegan"
            id="vegan"
          />
          <label htmlFor="gluten_free">Senza glutine</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="checkbox"
            name="gluten_free"
            id="gluten_free"
          />
          <label htmlFor="lactose_free">Senza lattosio</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="checkbox"
            name="lactose_free"
            id="lactose_free"
          />
          <label htmlFor="spicy">Piccante</label>
          <input
            className="border rounded border-gray-900 py-2 px-4"
            type="checkbox"
            name="spicy"
            id="spicy"
          />
          <button
            className="border rounded border-gray-900 hover:bg-gray-300 py-2 px-4 mt-4"
            type="submit"
          >
            Aggiungi
          </button>
        </form>
      </div>
    </div>
  );
}
