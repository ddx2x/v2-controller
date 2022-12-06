import { DownOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Button, Dropdown, Popconfirm, Space } from 'antd';
import { DescriptionsProps, useDescriptions } from '../descriptions';
import { FormProps, useForm } from '../form';
import { randomKey } from '../helper';

// 更多按钮
export declare type MoreButtonType = (
  { btkind: 'descriptions' } & DescriptionsProps | // 详情页
  { btkind: 'form'; } & FormProps | // 表单
  { btkind: 'link'; } & { link: string, title: string } | // 跳转
  { btkind: 'confirm'; } & { onClick: (e?: React.MouseEvent) => void, title: string, text?: string } | // 确认框自定义操作
  { btkind: 'editable'; } & {title?: string}
) & { fold?: boolean } // 放入折叠框

export const injectTableOperate = (moreMenuButton: (record: any) => MoreButtonType[], columns: any[]): any[] => {
  columns = columns.filter(item => item.dataIndex != 'more')

  columns.push({
    dataIndex: 'more',
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    render: (text: any, record: any, _: any, action: any) => {
      let notFold: any[] = []
      let items: any[] = []

      moreMenuButton(record).map(item => {
        let label = (() => {
          switch (item.btkind) {
            case 'descriptions':
              const [descriptionDom] = useDescriptions({ ...item })
              return descriptionDom
            case 'form':
              const [formDom] = useForm({ ...item })
              return formDom
            case 'link':
              return (
                <Button type='link' size='small' block>
                  <Link to={item.link}>{item.title}</Link>
                </Button>
              )
            case 'confirm':
              return (
                <Popconfirm
                  key="popconfirm"
                  overlayStyle={{ zIndex: 1051 }}
                  title={item.text || `确认${item.title}吗 ?`}
                  okText="是"
                  cancelText="否"
                  onConfirm={(e) => item.onClick(e)}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button type='link' size='small' block onClick={(e) => e.stopPropagation()}>{item.title}</Button>
                </Popconfirm>
              )
            case 'editable':
              return <Button
                type='link' size='small' block
                key="editable"
                onClick={() => {
                  action?.startEditable?.(record.uid);
                }}
              >
                {item.title || '编辑' }
              </Button>
            default:
              return <Button type='link' size='small' block>请定义操作</Button>
          }
        })()

        item.fold ? items.push({ label: label, key: randomKey(5, { numbers: false }) }) : notFold.push(label)
      })
      return (
        <>
          <Space>
            {notFold.map(item => item)}
            <Dropdown menu={{ items }}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  操作
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        </>
      )
    },
  })
  return columns
}