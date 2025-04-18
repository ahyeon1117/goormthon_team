import { useContext } from 'react';
import { FileContext } from './FileContextType';

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('Provider 내에서 useFile훅을 사용해야 합니다.');
  }
  return context;
};
