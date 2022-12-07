import { DownOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Dropdown, MenuProps, message, Popconfirm, Space } from 'antd';
import { DescriptionsProps, useDescriptions } from '../descriptions';
import { FormProps, useForm } from '../form';
import { randomKey } from '../helper';

// 更多按钮
export declare type MoreButtonType = (
  | ({ kind: 'descriptions' } & DescriptionsProps) // 详情页
  | ({ kind: 'form' } & FormProps) // 表单
  | ({ kind: 'link' } & { link: string; title: string }) // 跳转
  | ({ kind: 'confirm' } & {
    onClick: (e?: React.MouseEvent) => void;
    title: string;
    text?: string;
  }) // 确认框自定义操作
  | ({ kind: 'editable' } & { title?: string })
)
  & {
    tableMenu?: boolean, // 放入菜单
    collapseTableMenu?: boolean;
    toolBarAction?: boolean,
    collapseToolBarAction?: boolean
  }; // 放入折叠框


export const operationGroup = (
  moreMenuButton: ((record?: any, action?: any) => MoreButtonType[]) | undefined,
  record: any = {},
  action: any = null
): ({
  label: React.ReactNode;
  trigeer: () => void;
  key: string;
  tableMenu: true;
  collapseTableMenu: boolean;
  toolBarAction: boolean;
  collapseToolBarAction: boolean;
})[] => {

  if (!moreMenuButton) return []
  let options = moreMenuButton(record, action).map((item) => {
    const rest = {
      key: randomKey(5, { numbers: false }),
      tableMenu: item.tableMenu || true,
      collapseTableMenu: item.collapseTableMenu || false,
      toolBarAction: item.toolBarAction || false,
      collapseToolBarAction: item.collapseToolBarAction || false
    }

    // descriptions
    if (item.kind == 'descriptions') {
      const [descriptionDom] = useDescriptions({ ...item });
      // return {
      //   label: descriptionDom,
      //   trigeer: () => { },
      //   ...rest
      // }
    }
    // form
    if (item.kind == 'form') {
      const [formDom] = useForm({ ...item });
      // return {
      //   label: formDom,
      //   trigeer: () => { },
      //   ...rest
      // };
    }
    // link
    if (item.kind == 'link') {
      return {
        label: (
          <Button type="link" size="small" block>
            <Link to={item.link}>{item.title}</Link>
          </Button>
        ),
        trigeer: () => { },
        ...rest
      };
    }
    // confirm
    if (item.kind == 'confirm') {
      return {
        label: (
          <Popconfirm
            key="popconfirm"
            overlayStyle={{ zIndex: 1051 }}
            title={item.text || `确认${item.title}吗 ?`}
            okText="是"
            cancelText="否"
            onConfirm={(e) => item.onClick(e)}
            onCancel={(e) => e?.stopPropagation()}
          >
            <Button type="link" size="small" block onClick={(e) => e.stopPropagation()}>
              {item.title}
            </Button>
          </Popconfirm>
        ),
        trigeer: () => { },
        ...rest
      };
    }
    // editable
    if (item.kind == 'editable') {
      return {
        label: (
          <Button
            type="link"
            size="small"
            block
            key="editable"
            onClick={() => {
              record.uid && action?.startEditable?.(record?.uid);
            }}
          >
            {item.title || '编辑'}
          </Button>
        ),
        trigeer: () => { },
        ...rest
      };
    }
    return {
      label: (
        <Button type="link" size="small" block>
          请定义操作
        </Button>
      ),
      trigeer: () => message.warning('请定义操作'),
      ...rest
    }
  })

  return options
}

export const CollapseMeuButton: React.FC<{ items: MenuProps['items'] }> = (props) => {
  const { items } = props
  return (
    <Dropdown menu={{ items }}>
      <Button type="link" size="small" block onClick={(e) => e.preventDefault()}>
        操作
        <DownOutlined sizes={'small'}/>
      </Button>
    </Dropdown>
  )
}

