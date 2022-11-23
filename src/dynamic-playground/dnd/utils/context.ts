import { createContext } from 'react';

export const Ctx = createContext(() => { });
export const StoreCtx = createContext<{
  flatten: any,
  userProps: any
  preview: boolean
}>({
  flatten: {},
  userProps: {},
  preview: false
});