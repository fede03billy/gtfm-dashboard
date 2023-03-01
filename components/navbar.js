// a lateral navbar with 3 options: order, menu, settings

export default function Navbar() {
  return (
    <div className="h-screen bg-gray-800">
      <div className="flex flex-col px-3 py-5">
        <div className="text-xl text-gray-500">ORDER</div>
        <div className="text-xl text-gray-500">MENU</div>
        <div className="text-xl text-gray-500">SETTINGS</div>
      </div>
    </div>
  );
}
