// table component, this one will show the order for the specific table
import { usePopupUpdate } from './popupContext';
import { useTableUpdate } from './popupContext';

export default function Table({ table, color }) {
  const togglePopup = usePopupUpdate();
  const selectTable = useTableUpdate();

  function handleClick() {
    selectTable(table);
    togglePopup();
  }

  const classContent = `flex cursor-pointer justify-center text-4xl text-black text-opacity-20 py-10 font-thin align-center shadow h-32 w-32 m-4 rounded-md ${color}`;

  return (
    <div onClick={handleClick} className={classContent}>
      {table}
    </div>
  );
}
