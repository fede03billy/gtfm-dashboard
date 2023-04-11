import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';

export default function Menu({ restaurant_id }) {
  const [menu, setMenu] = React.useState([]);
  const [currentCategory, setCurrentCategory] = React.useState('Tutto');
  const [categories, setCategories] = React.useState(new Set());
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
          result.forEach((item) => {
            setCategories(categories.add(item.category));
          });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [menu]);

  useEffect(() => {
    // add a class to the selected category
    const buttons = document.getElementsByClassName('category');
    // cycle through the buttons and add the class to the selected category
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerText === currentCategory) {
        buttons[i].classList.remove('bg-sky-300');
        buttons[i].classList.add('bg-sky-400');
      } else {
        buttons[i].classList.remove('bg-sky-400');
        buttons[i].classList.add('bg-sky-300');
      }
    }
  }, [currentCategory]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4">
      <div className="mb-4 mt-[-16px] mx-[-16px] sticky top-0 left-0 bg-sky-200 p-4 shadow">
        <div className="flex flex-row justify-between pb-2">
          <h1 className="text-4xl text-black text-opacity-70 mb-4">Menù</h1>
          <button
            className="py-2 px-4 rounded shadow h-10 bg-sky-300"
            onClick={() => setIsDialogOpen(true)}
          >
            Aggiungi
          </button>
        </div>
        <div className="categories scrollbar-hide flex w-full overflow-x-auto overflow-hidden scroll-smooth pb-2 whitespace-nowrap mr-[-16px]">
          <button
            className="category bg-sky-300 py-2 px-4 hover:bg-sky-400 mr-2 shadow rounded"
            onClick={() => {
              setCurrentCategory('Tutto');
            }}
          >
            Tutto
          </button>
          {categories &&
            Array.from(categories).map((item, index) => (
              <button
                className="category bg-sky-300 py-2 px-4 hover:bg-sky-400 mr-2 shadow rounded"
                onClick={() => {
                  setCurrentCategory(item);
                }}
                key={index}
              >
                {item}
              </button>
            ))}
        </div>
      </div>
      <ul>
        {menu.length && currentCategory === 'Tutto'
          ? menu.map((item) => (
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
            ))
          : menu.map(
              (item) =>
                item.category === currentCategory && (
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
                )
            )}
      </ul>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(!isDialogOpen)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/[0.4]">
          <Dialog.Panel className="w-full max-w-4xl rounded bg-gray-200 p-4">
            <Dialog.Title>Aggiungi un nuovo piatto al menù</Dialog.Title>
            <Dialog.Description>Seleziona le cose</Dialog.Description>
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
