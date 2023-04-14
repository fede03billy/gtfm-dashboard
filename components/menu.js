import React, { Suspense, useEffect } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import Loading from './loading.js';
import { set } from 'mongoose';

export default function Menu({ restaurant_id }) {
  const [menu, setMenu] = React.useState([]);
  const [currentCategory, setCurrentCategory] = React.useState('Tutto');
  const [categories, setCategories] = React.useState(new Set());
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const spicy =
    'https://www.svgrepo.com/show/383337/vegetable-food-pepper-chilli-spicy.svg';
  const vegan = 'https://www.svgrepo.com/show/510319/vegan.svg';
  const lactoseFree = 'https://www.svgrepo.com/show/509875/dairy-free.svg';
  const glutenFree = 'https://www.svgrepo.com/show/509969/gluten-free.svg';

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
    return <Loading />;
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
        {menu.length > 0 &&
          (currentCategory === 'Tutto'
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
              ))}
      </ul>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(!isDialogOpen)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/[0.4]">
          <Dialog.Panel className="w-96 rounded bg-sky-50 p-4 relative flex flex-col items-center">
            <Dialog.Title className="text-center font-bold">
              Aggiungi un nuovo piatto al menù
            </Dialog.Title>
            <Dialog.Description className="mb-4 mt-2 text-black text-opacity-30 text-xs font-thin text-center">
              Inserisci i dati del piatto e clicca su "Aggiungi"
            </Dialog.Description>
            <form
              className="flex flex-col gap-4 w-full items-left"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !e.target.name.value ||
                  !e.target.price.value ||
                  !e.target.description.value ||
                  !e.target.category.value
                ) {
                  alert('Mancano dei dati.');
                  return;
                }
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
                      setIsDialogOpen(false);
                      setMenu(result);
                    },
                    (error) => {
                      setIsLoaded(true);
                      setError(error);
                    }
                  );
              }}
            >
              <div className="flex justify-between items-center">
                <label htmlFor="name">Nome</label>
                <input
                  className="border rounded border-gray-900 py-2 px-4 ml-auto"
                  type="text"
                  name="name"
                  id="name"
                  placeholder='es. "Pizza Margherita"'
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="price">Prezzo</label>
                <input
                  className="border rounded border-gray-900 py-2 px-4"
                  type="number"
                  name="price"
                  min={0}
                  id="price"
                  placeholder='es. "550"'
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="description">Descrizione</label>
                <input
                  className="border rounded border-gray-900 py-2 px-4"
                  type="text"
                  name="description"
                  id="description"
                  placeholder='es. "Pizza con pomodoro, mozzarella e basilico"'
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="category">Categoria</label>
                <input
                  className="border rounded border-gray-900 py-2 px-4"
                  type="text"
                  name="category"
                  id="category"
                  placeholder='es. "Primi"'
                />
              </div>
              <div className="flex flex-row mt-2 mx-auto">
                <div className="flex flex-row">
                  <label className="mr-2" htmlFor="vegan">
                    <Image src={vegan} width={20} height={20} title="vegan" />
                  </label>
                  <input
                    className="border rounded border-gray-900 py-2 px-4"
                    type="checkbox"
                    name="vegan"
                    id="vegan"
                  />
                </div>
                <div className="flex flex-row">
                  <label className="mr-2 ml-6" htmlFor="gluten_free">
                    <Image
                      src={glutenFree}
                      width={20}
                      height={20}
                      title="gluten free"
                    />
                  </label>
                  <input
                    className="border rounded border-gray-900 py-2 px-4"
                    type="checkbox"
                    name="gluten_free"
                    id="gluten_free"
                  />
                </div>
                <div className="flex flex-row">
                  <label className="mr-2 ml-6" htmlFor="lactose_free">
                    <Image
                      src={lactoseFree}
                      width={20}
                      height={20}
                      title="lactose free"
                    />
                  </label>
                  <input
                    className="border rounded border-gray-900 py-2 px-4"
                    type="checkbox"
                    name="lactose_free"
                    id="lactose_free"
                  />
                </div>
                <div className="flex flex-row">
                  <label className="mr-2 ml-6" htmlFor="spicy">
                    <Image src={spicy} width={20} height={20} title="spicy" />
                  </label>
                  <input
                    className="border rounded border-gray-900 py-2 px-4"
                    type="checkbox"
                    name="spicy"
                    id="spicy"
                  />
                </div>
              </div>
              <button
                className="rounded shadow bg-sky-300 hover:bg-sky-400 py-2 px-4 mt-4"
                type="submit"
              >
                Aggiungi
              </button>
            </form>
            <button
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="bg-sky-100 aspect-square p-2 rounded shadow hover:bg-sky-200 max-w-xs absolute top-4 right-4"
            >
              <Image
                src="https://www.svgrepo.com/show/500512/close-bold.svg"
                width={20}
                height={20}
              />
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
