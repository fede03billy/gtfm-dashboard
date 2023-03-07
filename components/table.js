// table component, this one will show the order for the specific table
import { usePopupUpdate } from './popupContext';
import { useTableUpdate } from './popupContext';

export default function Table({ table }) {
  const togglePopup = usePopupUpdate();
  const selectTable = useTableUpdate();

  function handleClick() {
    selectTable(table);
    togglePopup();
  }

  return (
    <div
      onClick={handleClick}
      className="h-32 w-32 m-4 bg-slate-600 rounded-md"
    >
      {table}
    </div>
  );
}
