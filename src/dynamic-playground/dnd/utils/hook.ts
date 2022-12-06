import { useContext, useReducer } from 'react';
import { Ctx, StoreCtx } from './context';

type GlobalState = {
  tabsKey: string;
  showRight: boolean;
  showItemSettings: boolean;
};

// 使用最顶层组件的 setState
export const useGlobal = () => {
  return useContext(Ctx);
};

// 组件最顶层传入的所有props
export const useStore = () => {
  return useContext(StoreCtx);
};

// 类似于 class component 的 setState
export const useSet = (initState: GlobalState) => {
  const [state, setState] = useReducer((state: any, newState: any) => {
    let action = newState;
    if (typeof newState === 'function') {
      action = action(state);
    }
    if (newState.action && newState.payload) {
      action = newState.payload;
      if (typeof action === 'function') {
        action = action(state);
      }
    }
    return { ...state, ...action };
  }, initState);

  const setStateWithActionName = (state: any) => {
    setState(state);
  };

  return [state, setStateWithActionName];
};
