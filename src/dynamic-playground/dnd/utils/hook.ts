import { useContext } from 'react';
import { StoreCtx } from './context';

// 组件最顶层传入的所有props
export const useStore = () => {
  return useContext(StoreCtx);
};