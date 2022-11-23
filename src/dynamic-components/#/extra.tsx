import type {
  ButtonProps,
  RadioProps,
  SwitchProps
} from 'antd';
import {
  Button,
  Radio,
  Switch
} from 'antd';

export type ExtraAction =
  { valueType: 'button' } & ButtonProps |
  { valueType: 'switch' } & SwitchProps |
  { valueType?: 'radio' } & RadioProps

export const extraAction = (item: ExtraAction) => {
  switch (item.valueType) {
    case 'button':
      return <Button {...item} />;
    case 'switch':
      return <Switch {...item} />;
    case 'radio':
      return <Radio {...item} />;
    default:
      return null;
  }
};

export const extraActionArray = (items: ExtraAction[]) => {
  return items?.map((item) => {
    return extraAction(item);
  });
};
