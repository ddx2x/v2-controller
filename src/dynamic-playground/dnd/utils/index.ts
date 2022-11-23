export * from './context';
export * from './hook';

export const dndType = 'playground'

function stringContains(str: string, text: string) {
  return str.indexOf(text) > -1;
}
export const isObject = (a: any) =>
  stringContains(Object.prototype.toString.call(a), 'Object');

