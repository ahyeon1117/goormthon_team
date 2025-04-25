import { createContext, useContext, useState } from 'react';

type DropdownType = 'folder' | 'file';

type DropdownState = {
  visible: boolean;
  x: number;
  y: number;
  id: number | null;
  type: DropdownType | null;
};

const defaultState: DropdownState = {
  visible: false,
  x: 0,
  y: 0,
  id: null,
  type: null,
};

const DropdownContext = createContext<{
  dropdown: DropdownState;
  openDropdown: (x: number, y: number, id: number, type: DropdownType) => void;
  closeDropdown: () => void;
}>({
  dropdown: defaultState,
  openDropdown: () => {},
  closeDropdown: () => {},
});

export const DropdownProvider = ({ children }: { children: React.ReactNode }) => {
  const [dropdown, setDropdown] = useState(defaultState);

  const openDropdown = (x: number, y: number, id: number, type: DropdownType) => {
    setDropdown({ visible: true, x, y, id, type });
  };

  const closeDropdown = () => {
    setDropdown(defaultState);
  };

  return (
    <DropdownContext.Provider value={{ dropdown, openDropdown, closeDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => useContext(DropdownContext);
