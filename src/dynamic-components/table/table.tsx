import {
  ActionType, ProCard, ProFormInstance,
  ProTable,
  ProTableProps,
  RouteContextType
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, FormInstance, Input, Space, Tree } from 'antd';
import { DataNode, EventDataNode } from 'antd/lib/tree';
import type { Location } from 'history';
import { merge } from 'lodash';
import { observable, ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { FooterToolbar } from '../footer';
import { RouterHistory } from '../router';
import { ExpandedConfig, expandModule } from './expand';
import { MenuButtonGroup, MenuButtonType } from './more';

// 🌲树父节点
const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};



const defaulScrollHeight = '500px';

export declare type TableProps = Omit<ProTableProps<any, any>, 'pagination' | 'onRow' | 'search'> & {
  useSearch?: boolean // 开启搜索
  useBatchDelete?: boolean; // 开启批量删除
  useTableMoreOption?: boolean // 开启表单才对
  usePagination?: boolean; // 开启分页
  useSiderTree?: boolean; // 侧边树
  treeData?: DataNode[];
  tableMenu?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarMenu?: () => MenuButtonType[];
  footerButton?: () => MenuButtonType[];
  tableHeight?: string | number; // 表格高度
  onNext?: (
    params?: any,
    sort?: any,
    filter?: any,
    treeSelectedNode?: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 虚拟滚动 加载数据
  // 批量删除
  batchDelete?: (selectedRows: any) => void; // 批量删除回调函数
  isExpandNode?: boolean;
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
    useSearch,
    useBatchDelete,
    useTableMoreOption,
    usePagination,
    useSiderTree,
    // 挂载
    editable,
    location,
    mount,
    unMount,
    // 列表
    onNext,
    columns,
    // 展开
    isExpandNode,
    expand,
    // 高度
    tableHeight,
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
  const [treeSelectedNode, setTreeSelectedNode] = useState<EventDataNode<DataNode>>()

  mount && mount(location, actionRef, formRef, configMap)

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

  // 多选
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (_: any, selectedRows: any) => setSelectedRows(selectedRows),
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


  // 提示操作按钮
  const Footer: React.FC = () => {
    return (
      <FooterToolbar routeContext={routeContext || {}}>
        <Space size={6}>
          {selectedRows.length > 0 ? (
            <>
              <Button
                type="link"
                onClick={async () => {
                  batchDelete && batchDelete(selectedRows);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
              </Button>
              <Button type="link" onClick={async () => setSelectedRows([])}>
                <FormattedMessage
                  id="pages.searchTable.cancelSelection"
                  defaultMessage="取消选择"
                />
              </Button>
            </>
          ) : null}
        </Space>
      </FooterToolbar >
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

    // 子节点展开项
    if (isExpandNode) {
      return (
        <div
          ref={tableHeight !== '100%' ? setContainer : null}
          style={{ marginRight: 15, marginTop: 10, marginBottom: 10 }}
        >
          {domList.table}
        </div>
      );
    }

    // 侧边搜索树🌲
    if (useSiderTree) {
      const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>([]);
      const [treeSearchValue, setTreeSearchValue] = useState('');
      const [autoExpandParent, setAutoExpandParent] = useState(true);

      const treeDataList: { key: React.Key; title: string }[] = [];
      const generateList = (data: DataNode[]) => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key } = node;
          treeDataList.push({ key, title: key as string });
          if (node.children) {
            generateList(node.children);
          }
        }
      };

      generateList(rest['treeData'] || []);

      const onTreeExpand = (newExpandedKeys: React.Key[]) => {
        setTreeExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
      }

      const onTreeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 树搜索框搜索值
        const { value } = e.target;
        const newExpandedKeys = treeDataList.map((item) => {
          if (typeof item.title !== 'string') return null
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, rest['treeData'] || []);
          }
          return null;
        })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        setTreeExpandedKeys(newExpandedKeys as React.Key[]);
        setTreeSearchValue(value);
        setAutoExpandParent(true);
      };

      const withTreeWidth = useMemo(() => {
        const { hasSiderMenu, isMobile, siderWidth } = routeContext || {};
        if (!hasSiderMenu) {
          return undefined;
        }
        // 0 or undefined
        if (!siderWidth) {
          return '100%';
        }
        return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        routeContext?.collapsed,
        routeContext?.hasSiderMenu,
        routeContext?.isMobile,
        routeContext?.siderWidth,
      ]);

      const treeData = useMemo(() => {
        let tD = rest['treeData'] || []
        const loop = (data: DataNode[]): DataNode[] =>
          data.map((item) => {
            const strTitle = item.title as string;
            const index = strTitle.indexOf(treeSearchValue);
            const beforeStr = strTitle.substring(0, index);
            const afterStr = strTitle.slice(index + treeSearchValue.length);
            const title =
              index > -1 ? (
                <span>
                  {beforeStr}
                  <span className="site-tree-search-value">{treeSearchValue}</span>
                  {afterStr}
                </span>
              ) : (
                <span>{strTitle}</span>
              );
            if (item.children) {
              return { title, key: item.key, children: loop(item.children) };
            }

            return {
              title,
              key: item.key,
            };
          });
        return loop(tD);
      }, [treeSearchValue]);

      return (
        <>
          <div style={{ display: 'flex' }}>
            <ProCard bordered style={{ width: 249, marginRight: 7 }}>
              <Input style={{ marginBottom: 8 }} placeholder="搜索" onChange={onTreeSearchChange} />
              <Tree
                blockNode
                showLine
                treeData={treeData}
                onExpand={onTreeExpand}
                expandedKeys={treeExpandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={(_: any, { node }) => { setTreeSelectedNode(node); actionRef.current?.reload() }}
              />
            </ProCard>
            <div ref={setContainer} style={{ width: withTreeWidth }}>
              {defaultDom}
              {!usePagination && <LoadMore />}
            </div>
          </div>
          <Footer />
        </>
      )
    }


    // 原生table
    return (
      <>
        <div ref={tableHeight !== '100%' ? setContainer : null}>{defaultDom}</div>
        {!usePagination && <LoadMore />}
        <Footer />
      </>
    );
  };


  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      height: tableHeight || defaulScrollHeight,
      debounceListRenderMS: 10000,
      resetTopWhenDataChange: false,
    });
  }, []);

  const defaultConfig: Partial<TableProps> = {
    // 工具栏操作
    toolbar: {
      actions: [
        <MenuButtonGroup menuButtons={toolBarMenu ? toolBarMenu() : []} />
      ],
    },
    editable: editable,
    expandable: {
      ...expandModule(expand ? expand : null),
    },
    tableRender: tableRender,
  };


  // 挂载行
  let newColumns = rest['columns'] || columns || [];

  if (useTableMoreOption) {
    const optionHooks = observable.array<{ tag: string; func: () => void }[]>()

    // 更多操作 按钮
    newColumns = newColumns.filter((item: { dataIndex: string }) => item.dataIndex != 'more');
    const moreColumns = {
      dataIndex: 'more',
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (text: any, record: any, index: any, action: any) => {
        return (
          <MenuButtonGroup
            menuButtons={tableMenu ? tableMenu(record, action) : []}
            hooks={(T) => { optionHooks[index] = T }}
          />
        )
      },
    };
    newColumns.push(moreColumns);

    // 绑定点击事件
    rest['onRow'] = (_: any, index: number) => {
      let events = {};
      onRowEvent &&
        onRowEvent.forEach((e) => {
          events[e.mouseEvent] = () => {
            if (typeof index == 'number') {
              optionHooks[index].filter((item) => item.tag == e.tag).forEach((hook) => hook.func());
            }
          };
        });
      return events;
    }
  }

  // 合并配置
  merge(rest, defaultConfig);
  merge(rest, Object.fromEntries(configMap));
  merge(rest, {
    components: rest.dataSource && rest.dataSource.length > 10 ? vComponents : undefined,
    pagination: usePagination ? {
    } : false,
    search: useSearch ? { labelWidth: 80 } : false,
    columns: newColumns,
  });

  const request = async (params: any, sort: {}, filter: {}) => {
    const { pageSize: size, current: current, ...more } = params;
    const order = sort;
    const page = current - 1;
    onNext && onNext({ limit: { size, page }, filter: { ...more } }, order, filter, treeSelectedNode, actionRef);
    return { success: true };
  }

  return (
    <ProTable
      columns={newColumns}
      request={request}
      actionRef={actionRef}
      formRef={formRef}
      rowSelection={rowSelection}
      scroll={{ y: tableHeight, x: '100%' }}
      {...rest}
    />
  );
});

Table.defaultProps = {
  useSearch: true,
  useBatchDelete: true,
  useTableMoreOption: true,
  usePagination: false,
  isExpandNode: false,
  cardBordered: true,
  tableHeight: defaulScrollHeight,
  options: { density: true, reload: false, fullScreen: false },
  columns: [],
};
