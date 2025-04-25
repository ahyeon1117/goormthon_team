import { useState } from 'react';

export const useDropdownMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const openMenu = (x: number, y: number) => {
    setPosition({ x, y });
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  return { visible, position, openMenu, closeMenu };
};
