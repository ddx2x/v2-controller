import { DownOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Dropdown, MenuProps, Popconfirm, Space } from 'antd';
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
} | null

// 更多按钮
export declare type MenuButtonType = { collapse?: boolean, key: string } & (
  | ({ kind: 'descriptions' } & DescriptionsProps) // 详情页
  | ({ kind: 'form' } & FormProps) // 表单
  | ({ kind: 'link' } & { link: string; title: string }) // 跳转
  | ({ kind: 'implement' } & { title?: string; onClick?: ((e?: React.MouseEvent) => void) | undefined; })
  | ({ kind: 'confirm' } & { title: string; text?: string; onClick?: ((e?: React.MouseEvent) => void) | undefined; }) // 确认框自定义操作
)

// 前置确认框
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


// 下拉框
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

export declare type MenuButtonGroupProps = {
  menuButtons: MenuButtonType[] | undefined,
  buttonType?: ButtonType,
  buttonSize?: ButtonSize
  gT?: (T: (() => void)[]) => void
}

export const MenuButtonGroup: React.FC<MenuButtonGroupProps> = (props) => {
  const { menuButtons, buttonType, buttonSize, gT } = props
  if (!menuButtons) return null

  let labels: React.ReactNode[] = []
  let collapseLabels: { label: React.ReactNode, key: string }[] = []
  let T: (() => void)[] = []

  menuButtons.forEach((item) => {
    const key = randomKey(5, { numbers: true })
    const collapse = item.collapse || false
    const bt = collapse ? 'link' : buttonType || 'link'
    const bs = buttonSize || 'small'

    let label = (() => {
      if (item.kind == 'descriptions') {
        const descriptionsDomRef = useRef<DescriptionsRef>();
        T.push(() => descriptionsDomRef.current?.open())
        return (
          <Descriptions ref={descriptionsDomRef} buttonType={bt} buttonSize={bs} {...item} />
        )
      }
      if (item.kind == 'form') {
        const formDomRef = useRef<FormRef>();
        T.push(() => formDomRef.current?.open())
        return (
          <Form ref={formDomRef} buttonType={bt} buttonSize={bs} {...item} />
        )
      }
      if (item.kind == 'link') {
        T.push(() => { })
        return (
          <Button type={bt} size={bs} block>
            <Link to={item.link}>{item.title}</Link>
          </Button>
        )
      }
      if (item.kind == 'confirm') {
        T.push(() => { })
        return (
          <ConfirmButton
            buttonType={bt} buttonSize={bs}
            key={randomKey(5, { numbers: false })}
            title={item.title} text={item.text}
            onClick={item.onClick}
          />
        )
      }
      if (item.kind == 'implement') {
        T.push(() => item.onClick)
        return (
          <Button type={bt} size={bs} block onClick={item.onClick} >
            {item.title || '编辑'}
          </Button >
        )
      }
      return null
    })()

    label && collapse ?
      collapseLabels.push({ label, key: randomKey(5, { numbers: false }) }) :
      labels.push(label)
  })

  gT && gT(T)

  return (
    (labels || collapseLabels) ?
      (<Space align='center' style={{ overflowX: 'scroll', width: '100%' }}>
        {labels.length > 0 && labels}
        {collapseLabels.length > 0 && <DropdownMenu items={collapseLabels} />}
      </Space>) :
      null
  )
}