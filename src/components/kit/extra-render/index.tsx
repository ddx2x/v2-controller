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

export type ExtraAny = Button | Switch | Radio;

export const extraRender = (item: ExtraAny) => {
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

export const extraRenderList = (items: ExtraAny[]) => {
  return items?.map((item) => {
    return extraRender(item);
  });
};
