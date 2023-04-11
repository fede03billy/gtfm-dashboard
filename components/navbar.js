// a lateral navbar with 3 options: order, menu, settings

export default function Navbar({ setter }) {
  function handleClick(e) {
    let selection = e.target.innerText;
    setter(selection);
  }

  return (
    <div className="h-screen bg-sky-800 overflow-hidden min-w-xs">
      <div className="flex flex-col p-4 font-light">
        <button
          className="text-lg bg-sky-500 rounded mb-4 px-4 py-2 hover:bg-sky-600 text-white disabled:opacity-30"
          onClick={handleClick}
        >
          ORDINI
        </button>
        <button
          className="text-lg bg-sky-500 rounded mb-4 px-4 py-2 hover:bg-sky-600 text-white disabled:opacity-30"
          onClick={handleClick}
        >
          MENU
        </button>
        <button
          className="text-lg bg-sky-500 rounded mb-4 px-4 py-2 hover:bg-sky-600 text-white disabled:opacity-30"
          onClick={handleClick}
          disabled
        >
          PAGAMENTI
        </button>
        <button
          className="text-lg bg-sky-500 rounded mb-4 px-4 py-2 hover:bg-sky-600 text-white disabled:opacity-30"
          onClick={handleClick}
          disabled
        >
          STATISTICHE
        </button>
        <button
          className="text-lg bg-sky-500 rounded mb-4 px-4 py-2 hover:bg-sky-600 text-white disabled:opacity-30"
          onClick={handleClick}
          disabled
        >
          SETTINGS
        </button>
      </div>
    </div>
  );
}
