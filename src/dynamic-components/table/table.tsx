import { ActionType, ProCard, ProTable, ProTableProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { AutoComplete, Button, ButtonProps, Radio, RadioProps, Space, Switch, SwitchProps } from 'antd';
import type { Location } from "history";
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { RouterHistory } from '../router';
import { ExpandedConfig, expandModule } from './expand';
import { injectTableOperate, MoreButtonType } from './more';

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

const defaulScrollHeight = '52vh';

export declare type TableProps = Omit<ProTableProps<any, any>, 'dataSource' | 'loading' | 'expandable'> & {
  loading?: Function | boolean
  dataSource?: Function | any[]
  virtualList?: boolean;
  expand?: ExpandedConfig;
  scrollHeight?: string | number; // 表格高度
  moreMenuButton?: (record: any) => MoreButtonType[],
  onNext?: (actionRef?: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
  // 全局搜索
  globalSearch?: {
    key?: string,
    title?: string,
    onSearch?: (
      value: any,
      setGlobalSearchOptions: React.Dispatch<React.SetStateAction<{
        label: any;
        value: any;
      }[]>>
    ) => void
  }
  // 鼠标事件
  onRowClick?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>
  ) => void // 单击行
  onRowDoubleClick?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>
  ) => void // 双击行
  onRowMouseEnter?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>
  ) => void // 鼠标触碰行
  onRowMouseLeave?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>
  ) => void // 鼠标离开行
} & RouterHistory & {
  mount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>
  ) => void
  unMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>
  ) => void
};

export const Table: React.FC<TableProps> = observer((props) => {
  const {
    location,
    mount,
    unMount,
    columns,
    expand,
    moreMenuButton,
    virtualList,
    loading,
    dataSource,
    onNext,
    scrollHeight,
    headerTitle,
    toolBarRender,
    intl,
    //
    useBatchDelete,
    batchDelete,
    // 全局搜索
    globalSearch,
    // 鼠标事件
    onRowClick,
    onRowDoubleClick,
    onRowMouseEnter,
    onRowMouseLeave,
    ...rest
  } = props;
  // ref
  const actionRef = useRef<ActionType>();

  // 页面挂载 销毁事件
  useEffect(() => {
    actionRef && mount && mount(location, actionRef)
    return () => actionRef && unMount && unMount(location, actionRef)
  }, [])

  // 挂载 鼠标事件
  useEffect(() => {
    window.addEventListener('mousemove', (evt: MouseEvent) => {
      if (
        evt.defaultPrevented ||
        (container !== null && container.contains(evt.target as Node))
      ) {
        document.body.style.overflow = "hidden";
        return
      }
      document.body.style.overflow = "visible";
    })
  })

  let newColumns = columns

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
  }, [onNext, scrollHeight]);

  if (virtualList) {
    rest.sticky = true;
    rest.scroll = {
      y: scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
    };
    rest.components = vComponents;
    rest.pagination = false;
  }

  // 全局搜索
  const [globalSearchOptions, setGlobalSearchOptions] = useState<{ label: any, value: any }[]>([])
  // 更多操作 按钮
  if (moreMenuButton && newColumns) {
    newColumns = injectTableOperate(moreMenuButton, newColumns)
  }

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [search, setSearch] = useState(!globalSearch)

  return (
    <>
      {!search && globalSearch && <ProCard bordered style={{ marginBottom: '10px' }}>
        <Space style={{ float: 'right' }}>
          全局搜索🔍：
          <AutoComplete
            allowClear
            options={globalSearchOptions}
            placeholder={'请输入搜索文本'}
            onSearch={async (value) => {
              globalSearch.onSearch &&
                await globalSearch.onSearch(value, setGlobalSearchOptions)
            }}
            style={{ width: '320px' }}
            />
          <Button type='primary' onClick={() => setSearch(!search)}>更多筛选</Button>
        </Space>
      </ProCard>
      }
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
        search={search && {
          labelWidth: 80,
          optionRender: (searchConfig, props, dom) => {
            return [
              ...dom,
              globalSearch && <Button type='primary' onClick={() => setSearch(!search)}>模糊搜索</Button>,]
          }
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
        dataSource={typeof dataSource == 'function' ? dataSource() : dataSource}
        rowSelection={dataSource ? rowSelection : false}
        onReset={() => props.onSubmit && props.onSubmit({})}
        expandable={expand && { ...expandModule(expand) }}
        tableRender={(_, defaultDom, { toolbar, alert, table }) => {
          return (
            <div ref={setContainer}>
              {defaultDom}
            </div>
          )
        }}
        onRow={(record) => {
          return {
            onClick: (event) => onRowClick && onRowClick(event, record, actionRef),
            onDoubleClick: (event) => onRowDoubleClick && onRowDoubleClick(event, record, actionRef),
            onMouseEnter: (event) => onRowMouseEnter && onRowMouseEnter(event, record, actionRef),
            onMouseLeave: (event) => onRowMouseLeave && onRowMouseLeave(event, record, actionRef)
          }
        }}
        {...rest}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button style={{ width: '350px' }} key='loadMore' onClick={() => onNext && onNext(actionRef)}>
          加载更多
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
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: { density: true, reload: true, fullScreen: false },
  columns: [],
};
