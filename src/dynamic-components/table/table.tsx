import { ActionType, ProCard, ProTable, ProTableProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {
  AutoComplete,
  Button,
  ButtonProps,
  Card,
  Radio,
  RadioProps,
  Space,
  Switch,
  SwitchProps,
  TablePaginationConfig
} from 'antd';
import type { Location } from 'history';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { RouterHistory } from '../router';
import { ExpandedConfig, expandModule } from './expand';
import { injectTableOperate, MoreButtonType } from './more';

export declare type ExtraAction =
  | ({ valueType: 'button' } & ButtonProps)
  | ({ valueType: 'switch' } & SwitchProps)
  | ({ valueType?: 'radio' } & RadioProps);

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

const defaulScrollHeight = 1000;

export declare type TableProps = Omit<
  ProTableProps<any, any>,
  'dataSource' | 'loading' | 'expandable' | 'pagination'
> & {
  loading?: any;
  dataSource?: any;
  virtualList?: boolean;
  scrollHeight?: string | number; // 表格高度
  moreMenuButton?: (record: any) => MoreButtonType[];
  onNext?: (
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    params?: { page: number; size: number },
  ) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
  pagination?: Omit<TablePaginationConfig, 'total'> & {
    total?: () => number | number;
  };
  expand?: ExpandedConfig;
  expanding?: boolean;
  // 全局搜索
  globalSearch?: {
    key?: string;
    title?: string;
    onSearch?: (
      value: any,
      setGlobalSearchOptions: React.Dispatch<
        React.SetStateAction<
          {
            label: any;
            value: any;
          }[]
        >
      >,
    ) => void;
  };
  // 鼠标事件
  onRowClick?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 单击行
  onRowDoubleClick?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 双击行
  onRowMouseEnter?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 鼠标触碰行
  onRowMouseLeave?: (
    event: React.MouseEvent,
    record: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 鼠标离开行
} & RouterHistory & {
  mount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  unMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
  ) => void;
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
    pagination,
    useBatchDelete,
    batchDelete,
    expanding,
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

  console.log('dataSource....', dataSource, loading);

  // 页面挂载 销毁事件
  useEffect(() => {
    actionRef && mount && mount(location, actionRef);
    return () => actionRef && unMount && unMount(location, actionRef);
  }, []);

  // 挂载 鼠标事件
  useEffect(() => {
    window.addEventListener('mousemove', (evt: MouseEvent) => {
      if (evt.defaultPrevented || (container !== null && container.contains(evt.target as Node))) {
        document.body.style.overflow = 'hidden';
        return;
      }
      document.body.style.overflow = 'visible';
    });
  });

  //
  let newColumns = columns;

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
  if (virtualList) {
    const vComponents = useMemo(() => {
      return VList({
        height: scrollHeight || defaulScrollHeight,
      });
    }, []);
    rest.components = vComponents;
  }

  // 全局搜索
  const [globalSearchOptions, setGlobalSearchOptions] = useState<{ label: any; value: any }[]>([]);
  // 更多操作 按钮
  if (moreMenuButton && newColumns) {
    newColumns = injectTableOperate(moreMenuButton, newColumns);
  }

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [search, setSearch] = useState(!globalSearch);

  const tableAlertOptionRender = () => {
    return (
      <Space size={6}>
        <Button
          type="link"
          onClick={async () => {
            batchDelete && batchDelete(selectedRowKeys);
            setSelectedRowKeys([]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
        </Button>
        <Button
          type="link"
          onClick={async () => {
            setSelectedRowKeys([]);
          }}
        >
          <FormattedMessage id="pages.searchTable.cancelSelection" defaultMessage="取消选择" />
        </Button>
      </Space>
    );
  };

  const LoadMore: React.FC = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          style={{ width: '350px' }}
          key="loadMore"
          onClick={() => onNext && onNext(actionRef)}
        >
          加载更多
        </Button>
      </div>
    );
  };

  const tableRender = (
    props: ProTableProps<any, any, 'text'>,
    defaultDom: JSX.Element,
    domList: {
      toolbar: JSX.Element | undefined;
      alert: JSX.Element | undefined;
      table: JSX.Element | undefined;
    },
  ): React.ReactNode | undefined => {
    if (expanding) {
      return (
        <Card bordered={false} style={{ background: '#fbfbfc' }}>
          {domList.table}
        </Card>
      );
    }

    return (
      <div>
        <div ref={virtualList ? setContainer : null}>{defaultDom}</div>
        <LoadMore />
      </div>
    );
  };

  return (
    <>
      {!search && globalSearch && (
        <ProCard bordered style={{ marginBottom: '10px' }}>
          <Space style={{ float: 'right' }}>
            全局搜索🔍：
            <AutoComplete
              allowClear
              options={globalSearchOptions}
              placeholder={'请输入搜索文本'}
              onSearch={async (value) => {
                globalSearch.onSearch &&
                  (await globalSearch.onSearch(value, setGlobalSearchOptions));
              }}
              style={{ width: '320px' }}
            />
            <Button type="primary" onClick={() => setSearch(!search)}>
              更多筛选
            </Button>
          </Space>
        </ProCard>
      )}
      <ProTable
        search={
          search && {
            labelWidth: 80,
            optionRender: (searchConfig, props, dom) => {
              return [
                ...dom,
                globalSearch && (
                  <Button type="primary" onClick={() => setSearch(!search)}>
                    模糊搜索
                  </Button>
                ),
              ];
            },
          }
        }
        tableAlertOptionRender={tableAlertOptionRender}
        // @ts-ignore
        pagination={
          pagination
            ? {
              ...pagination,
              onChange: (page, size) => onNext && onNext(actionRef, { page, size }),
              // @ts-ignore
              total:
                typeof pagination.total == 'function' ? pagination.total() : pagination.total,
            }
            : false
        }
        columns={newColumns}
        actionRef={actionRef}
        loading={typeof loading == 'function' ? loading() : loading}
        dataSource={typeof dataSource == 'function' ? dataSource() : dataSource}
        rowSelection={dataSource && rowSelection ? rowSelection : false}
        onReset={() => props.onSubmit && props.onSubmit({})}
        expandable={expand && { ...expandModule(expand) }}
        tableRender={tableRender}
        onRow={(record) => {
          return {
            onClick: (event) => onRowClick && onRowClick(event, record, actionRef),
            onDoubleClick: (event) =>
              onRowDoubleClick && onRowDoubleClick(event, record, actionRef),
            onMouseEnter: (event) => onRowMouseEnter && onRowMouseEnter(event, record, actionRef),
            onMouseLeave: (event) => onRowMouseLeave && onRowMouseLeave(event, record, actionRef),
          };
        }}
        {...rest}
      />
    </>
  );
});

Table.defaultProps = {
  type: 'list',
  virtualList: false,
  editable: {
    type: 'multiple',
  },
  expanding: false,
  cardBordered: true,
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: { density: true, reload: true, fullScreen: false },
  columns: [],
};
