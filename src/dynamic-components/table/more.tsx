import { DownOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Dropdown, MenuProps, Popconfirm, Space } from 'antd';
import { ButtonSize } from 'antd/es/button';
import { ButtonType } from 'antd/lib/button';
import React from 'react';
import { DescriptionsProps, useDescriptions } from '../descriptions';
import { FormProps, useForm } from '../form';
import { randomKey } from '../helper';

export declare type MenuButton = {
  key: string;
  label: React.ReactNode;
  collapse?: boolean;
  trigeer: () => void;
} | null

// 更多按钮
export declare type MenuButtonType = { collapse?: boolean, } & (
  | ({ kind: 'descriptions' } & DescriptionsProps) // 详情页
  | ({ kind: 'form' } & FormProps) // 表单
  | ({ kind: 'link' } & { link: string; title: string }) // 跳转
  | ({ kind: 'implement' } & { title?: string; onClick?: ((e?: React.MouseEvent) => void) | undefined; })
  | ({ kind: 'confirm' } & { title: string; text?: string; onClick?: ((e?: React.MouseEvent) => void) | undefined; }) // 确认框自定义操作
)

type ConfirmButtonType = {
  onClick: ((e?: React.MouseEvent) => void) | undefined;
  title: string;
  text?: string;
  buttonType: ButtonType
  buttonSize: ButtonSize
}

const ConfirmButton: React.FC<ConfirmButtonType> = (props) => {
  return <Popconfirm
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
      onClick={(e) => e.stopPropagation()}>
      {props.title}
    </Button>
  </Popconfirm>
}

export const DropdownMenu: React.FC<{ items: MenuProps['items'] }> = (props) => {
  const { items } = props
  return (
    <Dropdown menu={{ items }}>
      <Button type="link" size="small" block onClick={(e) => e.preventDefault()}>
        操作
        <DownOutlined sizes={'small'} />
      </Button>
    </Dropdown>
  )
}

export const menuButtonGroup = (
  buttons: MenuButtonType[] | undefined,
  bt?: ButtonType,
  bs?: ButtonSize
): [dom: React.ReactNode, group: MenuButton[]] => {
  if (!buttons) return [null, []]

  let group = buttons.map((item) => {
    const collapse = item.collapse || false
    const rest = { key: randomKey(5, { numbers: false }), collapse }
    const buttonType = collapse ? 'link' : bt || 'link'
    const buttonSize = bs || 'small'

    if (item.kind == 'descriptions') {
      const [descriptionDom] = useDescriptions({ ...item, buttonType, buttonSize });
      return { label: descriptionDom, trigeer: () => { }, ...rest }
    }
    else if (item.kind == 'form') {
      const [formDom] = useForm({ ...item, buttonType, buttonSize });
      return { label: formDom, trigeer: () => { }, ...rest };
    }
    else if (item.kind == 'link') {
      return {
        label: (
          <Button type={buttonType} size={buttonSize} block>
            <Link to={item.link}>{item.title}</Link>
          </Button>
        ),
        trigeer: () => { },
        ...rest
      };
    }
    else if (item.kind == 'confirm') {
      return {
        label: (
          <ConfirmButton
            onClick={item.onClick} title={item.title} text={item.text}
            buttonType={buttonType} buttonSize={buttonSize}
          />
        ),
        trigeer: () => item.onClick && item.onClick(),
        ...rest
      };
    }
    else if (item.kind == 'implement') {
      return {
        label: (
          <Button type={buttonType} size={buttonSize} block onClick={item.onClick} >
            {item.title || '编辑'}
          </Button >
        ),
        trigeer: () => item.onClick && item.onClick(),
        ...rest
      };
    }
    else {
      return null
    }
  })

  let noCollapse = group.filter(
    item => item && item.collapse == false
  )
  let inCollapse = group.filter(
    item => item && item.collapse == true
  ).map(
    item => {
      return item ? { label: item.label, key: item.key } : null
    }
  )
  const dom = (
    <Space align='center' style={{ overflowX: 'scroll', width: '100%' }}>
      {noCollapse.map(item => item?.label || null)}
      {inCollapse.length > 0 && <DropdownMenu items={inCollapse} />}
    </Space>
  )

  return [dom, group]
}