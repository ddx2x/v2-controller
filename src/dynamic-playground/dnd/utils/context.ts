import { createContext } from 'react';

export const Ctx = createContext<{
  selected: string;
}>({
  selected: '',
});

export const StoreCtx = createContext<{
  errorFields: any;
  selected: any;
  displaySchema: any;
  flatten: any;
  userProps: any;
  preview: boolean;
}>({
  errorFields: [],
  selected: '',
  displaySchema: {},
  flatten: {},
  userProps: {},
  preview: false,
});
