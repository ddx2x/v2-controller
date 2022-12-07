import { ActionType, ProTable, ProTableProps, RouteContextType } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {
  Button, Space, TablePaginationConfig
} from 'antd';
import type { Location } from 'history';
import { observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { FooterToolbar } from '../footer';
import { RouterHistory } from '../router';
import { ExpandedConfig, expandModule } from './expand';
import { menuButtonGroup, MenuButtonType } from './more';

const defaulScrollHeight = 1000;

export declare type TableMap = ProTableProps<any, any>

export declare type TableProps = TableMap & {
  moreMenuButton?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarAction?: () => MenuButtonType[];
  footerButton?: () => MenuButtonType[];
  virtualList?: boolean;
  scrollHeight?: string | number; // 表格高度
  onNext?: (
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    params?: { page: number; size: number },
  ) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  pagination?: Omit<TablePaginationConfig, 'total'> & {
    total?: () => number | number;
  };
  expand?: ExpandedConfig;
  expanding?: boolean;
  // hook
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
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
} & RouterHistory & {
  mount?: (
    location?: Location | undefined,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    configMap?: ObservableMap<any, any>
  ) => void;
  unMount?: (
    location?: Location | undefined,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    config?: ObservableMap<any, any>
  ) => void;
};

export const Table: React.FC<TableProps> = observer((props) => {

  let {
    // 挂载
    location,
    mount,
    unMount,
    // 列表
    virtualList,
    onNext,
    columns,
    // 展开
    expanding,
    expand,
    // 高度
    scrollHeight,
    // 工具栏
    toolBarRender,
    toolbar,
    // 按钮操作
    moreMenuButton,
    toolBarAction,
    footerButton,
    // 批量删除
    useBatchDelete,
    batchDelete,
    // 鼠标事件
    onRowClick,
    onRowDoubleClick,
    // hook
    intl,
    routeContext,
    ...rest
  } = props;

  const configMap = observable.map<any, any>({})

  // ref
  const actionRef = useRef<ActionType>();

  mount && mount(
    location, actionRef, configMap
  );
  // 页面挂载 销毁事件
  useEffect(() => {
    return () => unMount && unMount(
      location, actionRef, configMap
    );
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


  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // 提示操作按钮
  const Footer: React.FC = () => {
    return (
      <FooterToolbar routeContext={routeContext || {}}>
        <Space size={6}>
          {selectedRowKeys.length > 0 ? (
            <>
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
            </>) : null}
        </Space>
      </FooterToolbar>
    );
  };

  // 表单dom渲染
  const tableRender = (
    props: ProTableProps<any, any, 'text'>,
    defaultDom: JSX.Element,
    domList: {
      toolbar: JSX.Element | undefined; alert: JSX.Element | undefined; table: JSX.Element | undefined;
    }): React.ReactNode | undefined => {
    if (expanding) {
      return defaultDom;
    }

    // 加载更多按钮
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

    return (
      <>
        <div ref={virtualList ? setContainer : null}>{defaultDom}</div>
        <LoadMore />
        <Footer />
      </>
    );
  };


  // 挂载行
  let newColumns = columns || [];

  // 更多操作 按钮
  if (newColumns) {
    const [optionColumnsHide, setOptionColumnsHide] = useState(false)
    newColumns = newColumns.filter((item) => item.dataIndex != 'more');
    newColumns.push({
      dataIndex: 'more',
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInTable: optionColumnsHide,
      render: (text: any, record: any, index: any, action: any) => {
        let [dom, _] = menuButtonGroup(moreMenuButton ? moreMenuButton(record, action) : [])
        !dom && setOptionColumnsHide(true)
        return dom
      }
    })
  }

  // 工具栏操作
  let [dom, _] = menuButtonGroup(toolBarAction ? toolBarAction() : [])
  let toolBarActions = [dom]

  let defaultConfig = {
    columns: newColumns,
    toolbar: {
      actions: toolBarActions
    },
    pagination: {
      onChange: (page: number, size: number) => onNext && onNext(actionRef, { page, size })
    }
  }

  // 合并配置
  Object.assign(rest, defaultConfig)
  configMap.forEach((value, key) => {
    if (!rest[key]) {
      rest[key] = value;
      return
    }
    if (Array.isArray(rest[key]) && Array.isArray(value)) {
      rest[key].concat(value)
      return
    }
    if (typeof rest[key] == 'object' && typeof value == 'object') {
      rest[key] = Object.assign(rest[key], value)
      return
    }
  })

  return (
    <ProTable
      // ref
      actionRef={actionRef}
      // 搜索栏
      search={{ labelWidth: 80 }}
      onReset={() => props.onSubmit && props.onSubmit({})}
      rowSelection={rowSelection}
      // 扩展
      expandable={expand && { ...expandModule(expand) }}
      tableRender={tableRender}
      onRow={(record) => {
        return {
          onClick: (event) => onRowClick && onRowClick(event, record, actionRef),
          onDoubleClick: (event) =>
            onRowDoubleClick && onRowDoubleClick(event, record, actionRef),
        };
      }}
      {...rest}
    />
  );
});

Table.defaultProps = {
  virtualList: false,
  editable: {
    type: 'multiple',
  },
  expanding: false,
  cardBordered: true,
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: { density: true, reload: false, fullScreen: false },
  columns: [],
};
