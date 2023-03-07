import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();
const PopupUpdateContext = createContext();
const TableContext = createContext();
const TableUpdateContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function usePopupUpdate() {
  return useContext(PopupUpdateContext);
}

export function useTable() {
  return useContext(TableContext);
}

export function useTableUpdate() {
  return useContext(TableUpdateContext);
}

export function PopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [table, setTable] = useState(null);

  function togglePopup() {
    setIsOpen(!isOpen);
  }

  function selectTable(table) {
    setTable(table);
  }

  return (
    <PopupContext.Provider value={isOpen}>
      <PopupUpdateContext.Provider value={togglePopup}>
        <TableContext.Provider value={table}>
          <TableUpdateContext.Provider value={selectTable}>
            {children}
          </TableUpdateContext.Provider>
        </TableContext.Provider>
      </PopupUpdateContext.Provider>
    </PopupContext.Provider>
  );
}
