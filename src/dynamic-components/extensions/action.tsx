import {
  Button as AntdButton,
  ButtonProps,
  Radio as AntdRadio,
  RadioProps,
  Switch as AntdSwitch,
  SwitchProps,
} from 'antd';

interface Button extends ButtonProps {
  genre?: 'button';
}

interface Switch extends SwitchProps {
  genre?: 'switch';
}

interface Radio extends RadioProps {
  genre?: 'radio';
}

export type ExtraAction = Button | Switch | Radio;

export const extraAction = (item: ExtraAction) => {
  switch (item.genre) {
    case 'button':
      return <AntdButton {...item} />;
    case 'switch':
      return <AntdSwitch {...item} />;
    case 'radio':
      return <AntdRadio {...item} />;
    default:
      return null;
  }
};

export const extraActionArray = (items: ExtraAction[]) => {
  return items?.map((item) => {
    return extraAction(item);
  });
};
