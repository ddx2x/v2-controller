import {
  ActionType,
  ProFormInstance,
  ProTable,
  ProTableProps,
  RouteContextType,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, FormInstance, Space } from 'antd';
import type { Location } from 'history';
import { merge } from 'lodash';
import { observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { FooterToolbar } from '../footer';
import { randomKey } from '../helper';
import { RouterHistory } from '../router';
import { ExpandedConfig, expandModule } from './expand';
import { MenuButtonGroup, MenuButtonType } from './more';

const defaulScrollHeight = '500px';

export declare type TableProps = ProTableProps<any, any> & {
  useBatchDelete?: boolean; // 开启批量删除
  usePagination?: boolean; // 开启分页
  tableMenu?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarMenu?: () => MenuButtonType[];
  footerButton?: () => MenuButtonType[];
  scrollHeight?: string | number; // 表格高度
  editable?: (rows: any) => Promise<any>;
  onNext?: (
    params?: any,
    sort?: any,
    filter?: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 虚拟滚动 加载数据
  // 批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  expanding?: boolean;
  expand?: ExpandedConfig;
  // hook
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
  // 鼠标事件
  onRowEvent?: {
    mouseEvent: 'onClick' | 'onDoubleClick';
    tag: string; // 按钮
  }[];
} & RouterHistory & {
    mount?: (
      location?: Location | undefined,
      actionRef?: React.MutableRefObject<ActionType | undefined>,
      formRef?: React.MutableRefObject<FormInstance | undefined>,
      configMap?: ObservableMap<any, any>,
    ) => void;
    unMount?: (
      location?: Location | undefined,
      actionRef?: React.MutableRefObject<ActionType | undefined>,
      config?: ObservableMap<any, any>,
    ) => void;
  };

export const Table: React.FC<TableProps> = observer((props) => {
  let {
    // 批量删除
    useBatchDelete,
    usePagination,
    // 挂载
    editable,
    location,
    mount,
    unMount,
    // 列表
    onNext,
    columns,
    // 展开
    expanding,
    expand,
    // 高度
    scrollHeight,
    // 工具栏
    toolBarRender,
    // 按钮操作
    tableMenu,
    toolBarMenu,
    footerButton,
    batchDelete,
    // 鼠标事情
    onRowEvent,
    // hook
    intl,
    routeContext,
    ...rest
  } = props;

  const configMap = observable.map({});
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  mount && mount(location, actionRef, formRef, configMap);


  // 挂载 鼠标事件
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
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

  let paginationDom: any = null;

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
                <FormattedMessage
                  id="pages.searchTable.cancelSelection"
                  defaultMessage="取消选择"
                />
              </Button>
            </>
          ) : (
            paginationDom
          )}
        </Space>
      </FooterToolbar>
    );
  };

  // 表单dom渲染
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
      return defaultDom;
    }

    return (
      <>
        <div ref={scrollHeight !== '100%' ? setContainer : null}>{defaultDom}</div>
        {!usePagination && <LoadMore />}
        <Footer />
      </>
    );
  };

  // 工具栏操作
  const toolBarMenus = [
    <MenuButtonGroup
      key={randomKey(5, { numbers: false })}
      menuButtons={toolBarMenu ? toolBarMenu() : []}
    />,
  ];

  // 点击事件
  const onRow: TableProps['onRow'] = (data: any, index: any) => {
    let event = {};
    onRowEvent &&
      onRowEvent.forEach((item) => {
        event[item.mouseEvent] = () => {
          if (typeof index == 'number') {
            mT[index].filter((m) => m.tag == item.tag).forEach((f) => f.func());
          }
        };
      });
    return event;
  };

  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      height: scrollHeight || defaulScrollHeight,
      debounceListRenderMS: 10000,
      resetTopWhenDataChange: false,
    });
  }, []);

  const defaultConfig: Partial<TableProps> = {
    onRow,
    // size: 'small',
    toolbar: {
      actions: toolBarMenus,
    },
    editable: editable,
    expandable: {
      ...expandModule(expand ? expand : null),
    },
    tableRender: tableRender,
  };

  // 合并配置
  merge(rest, defaultConfig);
  merge(rest, Object.fromEntries(configMap));

  const [optionColumnsHide, setOptionColumnsHide] = useState(false);
  const mT = observable.array<{ tag: string; func: () => void }[]>()

  // 挂载行
  let newColumns = rest['columns'] || columns || [];

  // 更多操作 按钮
  newColumns = newColumns.filter((item: { dataIndex: string }) => item.dataIndex != 'more');
  const moreColumns = {
    dataIndex: 'more',
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    hideInTable: optionColumnsHide,
    render: (text: any, record: any, index: any, action: any) => {
      let buttons = tableMenu ? tableMenu(record, action) : [];
      buttons.length < 1 && setOptionColumnsHide(true);
      // 生成菜单
      const dom = (
        <MenuButtonGroup
          key={randomKey(5, { numbers: false })}
          menuButtons={buttons}
          gT={(T) => {
            mT[index] = T;
            // setMT(mT);
          }}
        />
      );
      !dom && setOptionColumnsHide(true);
      return dom;
    },
  };

  newColumns.push(moreColumns);

  merge(rest, {
    components: rest.dataSource && rest.dataSource.length > 10 ? vComponents : undefined,
    pagination: usePagination ? rest.pagination : false,
    search: rest.search ? { labelWidth: 80 } : rest.search,
    columns: newColumns,
  });

  async function request(params: any, sort: {}, filter: {}) {
    const { pageSize: size, current: current, ...more } = params;
    const response = { success: true };
    const order = sort;
    const page = current - 1;
    onNext && onNext({ limit: { size, page }, filter: { ...more } }, order, filter, actionRef);
    return response;
  }

  return (
    <ProTable
      columns={newColumns}
      request={request}
      actionRef={actionRef}
      formRef={formRef}
      rowSelection={rowSelection}
      scroll={{ y: scrollHeight, x: '100%' }}
      {...rest}
    />
  );
});

Table.defaultProps = {
  useBatchDelete: true,
  usePagination: false,
  expanding: false,
  cardBordered: true,
  scrollHeight: defaulScrollHeight,
  options: { density: true, reload: false, fullScreen: false },
  columns: [],
};
