// a lateral navbar with 3 options: order, menu, settings

export default function Navbar({ setter }) {
  function handleClick(e) {
    let selection = e.target.innerText;
    setter(selection);
  }

  return (
    <div className="h-screen bg-gray-800">
      <div className="flex flex-col px-3 py-5">
        <div className="text-xl text-gray-500" onClick={handleClick}>
          ORDINI
        </div>
        <div className="text-xl text-gray-500" onClick={handleClick}>
          MENU
        </div>
        <div className="text-xl text-gray-500" onClick={handleClick}>
          PAGAMENTI
        </div>
        <div className="text-xl text-gray-500" onClick={handleClick}>
          STATISTICHE
        </div>
        <div className="text-xl text-gray-500" onClick={handleClick}>
          SETTINGS
        </div>
      </div>
    </div>
  );
}
