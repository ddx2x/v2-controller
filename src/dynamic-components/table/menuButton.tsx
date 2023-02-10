import { DownOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Dropdown, MenuProps, message, Popconfirm, Space } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { ButtonType } from 'antd/lib/button';
import React, { useRef } from 'react';
import { Descriptions, DescriptionsProps, DescriptionsRef } from '../descriptions';
import { Form, FormProps, FormRef } from '../form';
import { randomKey } from '../helper';

export declare type MenuButton = {
  key: string;
  label: React.ReactNode;
  collapse?: boolean;
  trigeer: () => void;
} | null;

// 更多按钮
export declare type MenuButtonType = { title: string; collapse?: boolean | string } & (
  | ({ kind: 'descriptions' } & DescriptionsProps) // 详情页
  | ({ kind: 'form' } & FormProps) // 表单
  | ({ kind: 'link' } & { link: string }) // 跳转
  | ({ kind: 'implement' } & {
    onClick?: ((e?: React.MouseEvent) => void) | undefined;
  })
  | ({ kind: 'confirm' } & {
    text?: string;
    onClick?: ((e?: React.MouseEvent) => void) | undefined;
  })
); // 确认框自定义操作

// 前置确认框
type ConfirmButtonType = {
  onClick: ((e?: React.MouseEvent) => void) | undefined;
  title: string;
  text?: string;
  buttonType: ButtonType;
  buttonSize: ButtonSize;
};

const ConfirmButton: React.FC<ConfirmButtonType> = (props) => {
  return (
    <Popconfirm
      key="popconfirm"
      overlayStyle={{ zIndex: 1051 }}
      title={props.text || `确认${props.title}吗 ?`}
      okText="是"
      cancelText="否"
      onConfirm={(e) => props.onClick && props.onClick(e)}
      onCancel={(e) => e?.stopPropagation()}
    >
      <Button
        type={props.buttonType}
        size={props.buttonSize}
        block
        onClick={(e) => e.stopPropagation()}
      >
        {props.title}
      </Button>
    </Popconfirm>
  );
};

// 下拉框
export const DropdownMenu: React.FC<{
  title: string | undefined,
  items: MenuProps['items'],
  dropDownButtonType?: ButtonType
  dropDownButtonSize?: ButtonSize;
}> = (props) => {
  const { title, items, dropDownButtonType, dropDownButtonSize } = props;

  return (
    <Dropdown menu={{ items }} forceRender>
      <Button type={dropDownButtonType || "link"} size={dropDownButtonSize || 'small'} block onClick={(e) => e.preventDefault()} >
        {title || '操作'}
        <DownOutlined sizes={'small'} />
      </Button>
    </Dropdown>
  );
};

export declare type MenuButtonProps = {
  dropDownTitle?: string
  args?: any
  menus: MenuButtonType[] | undefined;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  dropDownButtonType?: ButtonType
  dropDownButtonSize?: ButtonSize;
  hooks?: (T: { title: string; func: () => void }[]) => void;
};

export const MenuButton: React.FC<MenuButtonProps> = (props) => {
  const { dropDownTitle, menus, buttonType, buttonSize, dropDownButtonType, dropDownButtonSize, hooks } = props;
  if (!menus) return null;

  let labels: React.ReactNode[] = [];
  let collapseLabels: { label: React.ReactNode; key: string }[] = [];
  let T: { title: string; func: () => void }[] = [];

  menus.forEach((item) => {
    const key = randomKey(5, { numbers: true });
    const collapse = item.collapse || false;
    const bt = collapse ? 'link' : buttonType || 'link';
    const bs = buttonSize || 'small';

    let label = (() => {
      if (item.kind == 'descriptions') {
        const descriptionsDomRef = useRef<DescriptionsRef>();
        T.push({ title: item.title, func: () => descriptionsDomRef.current?.open() });
        return (
          <Descriptions
            key={key}
            ref={descriptionsDomRef}
            buttonType={bt}
            buttonSize={bs}
            {...item}
          />
        );
      }
      if (item.kind == 'form') {
        const formDomRef = useRef<FormRef>();
        T.push({ title: item.title, func: () => formDomRef.current?.open() });
        return <Form key={key} ref={formDomRef} buttonType={bt} buttonSize={bs} {...item} />;
      }
      if (item.kind == 'link') {
        T.push({ title: item.title, func: () => message.info('没有实现该功能') });
        return (
          <Button key={key} type={bt} size={bs} block>
            <Link to={item.link}>{item.title}</Link>
          </Button>
        );
      }
      if (item.kind == 'confirm') {
        T.push({ title: item.title, func: () => message.info('没有实现该功能') });
        return (
          <ConfirmButton
            key={key}
            buttonType={bt}
            buttonSize={bs}
            title={item.title}
            text={item.text}
            onClick={item.onClick}
          />
        );
      }
      if (item.kind == 'implement') {
        T.push({ title: item.title, func: () => item.onClick && item.onClick() });
        return (
          <Button key={key} type={bt} size={bs} block onClick={item.onClick}>
            {item.title || '编辑'}
          </Button>
        );
      }
      return null;
    })();

    label && collapse
      ? collapseLabels.push({ label, key: randomKey(5, { numbers: false }) })
      : labels.push(label);
  });

  hooks && hooks(T);

  return labels || collapseLabels ? (
    <Space align="center" style={{ overflowX: 'scroll', width: '100%' }}>
      {labels.length > 0 && labels.map(item => item)}
      {collapseLabels.length > 0 && (
        <DropdownMenu
          title={dropDownTitle}
          items={collapseLabels}
          dropDownButtonType={dropDownButtonType}
          dropDownButtonSize={dropDownButtonSize}
        />
      )}
    </Space>
  ) : null;
};
