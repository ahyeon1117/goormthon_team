import { createContext, useContext, useState, ReactNode } from 'react';

type DropdownState = {
  visible: boolean;
  x: number;
  y: number;
  folderId: number | null;
};

const defaultState: DropdownState = {
  visible: false,
  x: 0,
  y: 0,
  folderId: null,
};

const DropdownContext = createContext<{
  dropdown: DropdownState;
  openDropdown: (x: number, y: number, folderId: number) => void;
  closeDropdown: () => void;
}>({
  dropdown: defaultState,
  openDropdown: () => {},
  closeDropdown: () => {},
});

export const DropdownProvider = ({ children }: { children: ReactNode }) => {
  const [dropdown, setDropdown] = useState(defaultState);

  const openDropdown = (x: number, y: number, folderId: number) => {
    setDropdown({ visible: true, x, y, folderId });
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
