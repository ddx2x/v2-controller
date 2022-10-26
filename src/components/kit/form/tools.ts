import { ProFormColumnsType } from '@ant-design/pro-components';

export type Columns =
  | ProFormColumnsType<any, 'text'>[]
  | ProFormColumnsType<any, 'text'>[][]
  | null
  | undefined;

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
