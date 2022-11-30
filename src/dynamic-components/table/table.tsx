import { DownOutlined } from '@ant-design/icons';
import { ActionType, ProTable, ProTableProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, ButtonProps, Dropdown, Popconfirm, Radio, RadioProps, Space, Switch, SwitchProps } from 'antd';
import { observer } from 'mobx-react';
import React, { useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { DescriptionsProps, useDescriptions } from '../descriptions';
import { FormProps, useForm } from '../form';
import { randomKey } from '../helper';

export declare type ExtraAction =
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

export declare type MoreButtonType = (
  { btkind: 'descriptions' } & DescriptionsProps | // 详情页
  { btkind: 'form'; } & FormProps | // 表单
  { btkind: 'link'; } & { link: string, title: string } | // 跳转
  { btkind: 'confirm'; } & { onClick: (e?: React.MouseEvent) => void, title: string, text?: string } // 确认框自定义操作
) & { fold?: boolean } // 放入折叠框

const defaulScrollHeight = '400px';

export declare type TableProps = Omit<ProTableProps<any, any>, 'dataSource' | 'loading'> & {
  loading?: Function | boolean
  dataSource?: Function | any[]
  virtualList?: boolean;
  scrollHeight?: string | number; // 表格高度
  moreMenuButton?: (record: any) => MoreButtonType[],
  onLoading?: (actionRef?: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
};

export const Table: React.FC<TableProps> = observer((props) => {
  const {
    columns,
    moreMenuButton,
    virtualList,
    loading,
    dataSource,
    onLoading,
    scrollHeight,
    headerTitle,
    toolBarRender,
    intl,
    //
    useBatchDelete,
    batchDelete,
    ...rest
  } = props;

  let newColumns = columns

  // ref
  const actionRef = useRef<ActionType>();

  // 多选 批量删除
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      height: scrollHeight || defaulScrollHeight
    });
  }, [onLoading, scrollHeight]);

  if (virtualList) {
    // rest.sticky = true;
    rest.scroll = {
      y: scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
    };
    rest.components = vComponents;
    rest.pagination = false;
  }

  // 更多操作 按钮
  if (moreMenuButton && newColumns) {
    newColumns = newColumns.filter(item => item.dataIndex != 'more')
    newColumns.push({
      dataIndex: 'more',
      title: '操作',
      valueType: 'option',
      fixed: true,
      render: (_, record) => {
        let notFold: any[] = []
        let items: any[] = []

        moreMenuButton(record).map(item => {
          let label = (() => {
            switch (item.btkind) {
              case 'descriptions':
                const [description] = useDescriptions({ ...item })
                return description
              case 'form':
                const [form] = useForm({ ...item })
                return form
              case 'link':
                return <Button type='link' size='small' block ><a href={item.link}>{item.title}</a></Button>
              case 'confirm':
                return (
                  <Popconfirm
                    key="popconfirm"
                    title={item.text || `确认${item.title}吗 ?`}
                    okText="是" cancelText="否" onConfirm={(e) => item.onClick(e)}>
                    <Button type='link' size='small' block >{item.title}</Button>
                  </Popconfirm>
                )
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
  }

  // 数据
  let data = typeof dataSource == 'function' ? dataSource() : dataSource

  return (
    <>
      <ProTable
        headerTitle={
          headerTitle
            ? headerTitle
            : intl &&
            intl.formatMessage({
              id: 'pages.searchTable.title',
              defaultMessage: 'Enquiry form',
            })
        }
        search={{
          labelWidth: 'auto',
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={6}>
              <Button
                type='link'
                onClick={async () => {
                  batchDelete && batchDelete(selectedRowKeys);
                  setSelectedRowKeys([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
              </Button>
              <Button
                type='link'
                onClick={async () => {
                  setSelectedRowKeys([]);
                }}
              >
                <FormattedMessage id="pages.searchTable.cancelSelection" defaultMessage="取消选择" />
              </Button>
            </Space>
          );
        }}
        columns={newColumns}
        actionRef={actionRef}
        loading={typeof loading == 'function' ? loading() : loading}
        dataSource={data}
        rowSelection={data ? rowSelection : false}
        toolBarRender={() => []}
        onReset={() => props.onSubmit && props.onSubmit({})}
        {...rest}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button style={{ width: '350px' }} key='loadMore' onClick={() => onLoading && onLoading(actionRef)}>
          加载更多
          {data.lenght > 0 || `（已展示${data.length}条）`}
        </Button>
      </div>
    </>
  );
});

Table.defaultProps = {
  type: 'list',
  virtualList: true,
  editable: {
    type: 'multiple',
  },
  cardBordered: true,
  // rowKey: 'uid',
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: { density: true, reload: true, fullScreen: false },
  columns: [],
};
