import {
  ActionType, EditableProTable, ProCard, ProCoreActionType, ProFormInstance, ProProvider, ProTableProps,
  RouteContextType
} from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/es/components/EditableTable';
import { useLocation } from '@umijs/max';
import { Pagination, Space, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import type { Location } from 'history';
import { observable } from 'mobx';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { FooterToolbar } from '../footer';
import { valueTypeMapStore } from '../valueType';
import { ExpandedConfig, expandModule } from './expand';
import { MenuButton, MenuButtonType } from './menuButton';

const defaulScrollHeight = '100%';

export declare type TableProps = Omit<EditableProTableProps<any, any>, 'toolBar' | 'onRow'> & {
  useBatchDelete?: boolean; // 开启批量删除
  useTableMoreOption?: boolean // 开启表单操作菜单
  useSiderTree?: boolean; // 侧边树
  editableValuesChange?: (record: any) => void
  treeData?: DataNode[];
  tableMenu?: (record?: any, action?: ProCoreActionType) => MenuButtonType[]; // 更多操作
  toolbarTitle?: string;
  toolBarMenu?: (selectedRows?: any, location?: Location | undefined) => MenuButtonType[];
  tableHeight?: string | number; // 表格高度
  // 虚拟滚动 加载数据
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
    title: string; // 按钮
  }[];
};

export const Table: React.FC<TableProps> = (props) => {
  let {
    columns,
    treeData,
    value,
    pagination,
    // 批量删除
    useBatchDelete,
    useTableMoreOption,
    useSiderTree,
    // 表格编辑
    editableValuesChange,
    // 展开
    isExpandNode,
    expand,
    // 高度
    tableHeight,
    // 工具栏
    toolbarTitle,
    toolBarRender,
    // 按钮操作
    tableMenu,
    toolBarMenu,
    batchDelete,
    // 鼠标事情
    onRowEvent,
    // hook
    intl,
    routeContext,
    ...rest
  } = props;

  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const location = useLocation();

  // 挂载 鼠标事件
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // window.addEventListener('mousemove', (evt: MouseEvent) => {
    //   if (evt.defaultPrevented || (container !== null && container.contains(evt.target as Node))) {
    //     document.body.style.overflow = 'hidden';
    //     return;
    //   }
    //   document.body.style.overflow = 'visible';
    // });
  });

  // 多选
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (_: any, selectedRows: any) => { setSelectedRows(selectedRows) },
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

    const paginationDom = () => {
      return (
        <Space size={6}>
          <Pagination
            {...pagination}
            current={actionRef.current?.pageInfo?.current || 1}
            pageSize={actionRef.current?.pageInfo?.pageSize || 0}
            showTotal={(total, range) => { return `已选择 ${selectedRows.length} 项， 第 ${range[0]}-${range[1]} 项 / 总共 ${total} 项` }}
            onChange={(page, pageSize) => {
              actionRef.current?.setPageInfo &&
                actionRef.current?.setPageInfo({
                  pageSize: pageSize,
                  current: page,
                  total: pagination ? pagination?.total : undefined
                })
            }}
            onShowSizeChange={(current, size) => {
              actionRef.current?.setPageInfo &&
                actionRef.current?.setPageInfo({
                  pageSize: size,
                  current: current,
                  total: pagination ? pagination?.total : undefined
                })
            }}
          />
        </Space>
      )
    }

    // 侧边搜索树🌲
    if (useSiderTree) {
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

      return (
        <>
          <div style={{ display: 'flex' }}>
            <ProCard bordered style={{ width: 249, marginRight: 7 }}>
              <Tree treeData={treeData || []} />
            </ProCard>
            <div ref={setContainer} style={{ width: withTreeWidth }}>
              {defaultDom}
            </div>
          </div>
          <FooterToolbar routeContext={routeContext || {}}>
            {pagination && paginationDom()}
          </FooterToolbar>
        </>
      )
    }

    // 原生table
    return (
      <>
        <div
        // ref={tableHeight !== '100%' ? setContainer : null}
        >
          {defaultDom}
        </div>
        <FooterToolbar routeContext={routeContext || {}}>
          {pagination && paginationDom()}
        </FooterToolbar>
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


  // 挂载行
  let newColumns = columns || [];
  newColumns = newColumns.filter((item) => item.dataIndex !== 'menuButton');

  if (useTableMoreOption) {
    const optionHooks = observable.array<{ title: string; func: () => void }[]>()
    // 更多操作 按钮
    newColumns.push({
      dataIndex: 'menuButton',
      title: '操作',
      hideInSearch: true,
      editable: false,
      width: 180,
      fixed: 'right',
      render: (text: any, record: any, index: any, action) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <MenuButton
              dropDownTitle='操作'
              menus={tableMenu ? tableMenu(record, action) : []}
              hooks={(T) => { optionHooks[index] = T }}
            />
          </div>
        )
      },
    });

    // @ts-ignore 绑定点击事件 单击 双击
    rest['onRow'] = (_: any, index: number) => {
      let events: any = {};
      onRowEvent &&
        onRowEvent.forEach((e) => {
          events[e.mouseEvent] = () => {
            if (typeof index == 'number') {
              optionHooks[index].filter((item) => item.title == e.title).forEach((hook) => hook.func());
            }
          };
        });
      return events;
    }
  }

  const recordCreatorPosition = 'hidden'
  const proProviderValues = useContext(ProProvider);

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: valueTypeMapStore.stores,
      }}
    >
      <EditableProTable
        columns={newColumns}
        value={value}
        editable={{
          type: 'multiple',
          editableKeys: value?.map(item => item[props['rowKey'] as string || 'id']) || [],
          actionRender: () => [],
          onValuesChange: (record) => editableValuesChange && editableValuesChange(record),
        }}
        recordCreatorProps={
          recordCreatorPosition !== 'hidden'
            ? {
              position: recordCreatorPosition as 'top',
              record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
            }
            : false
        }
        sticky
        // components={vComponents}
        actionRef={actionRef}
        formRef={formRef}
        rowSelection={rowSelection}
        scroll={{ x: 1500 }}
        search={{ labelWidth: 80 }}
        toolbar={{
          multipleLine: true,
          title: toolbarTitle,
          actions: [
            <MenuButton
              dropDownTitle='更多操作'
              menus={toolBarMenu ? toolBarMenu(selectedRows, location) : []}
              buttonType='primary'
              buttonSize='middle'
              dropDownButtonType='dashed'
              dropDownButtonSize='middle'
            />
          ],
        }}
        tableAlertRender={false}
        tableRender={tableRender}
        expandable={{
          ...expandModule(expand ? expand : null)
        }}
        pagination={{ ...pagination, style: { display: 'none' } }}
        {...rest}
      />
    </ProProvider.Provider>
  );
};

Table.defaultProps = {
  useBatchDelete: true,
  useTableMoreOption: true,
  isExpandNode: false,
  cardBordered: true,
  tableHeight: defaulScrollHeight,
  options: { density: true, reload: false, fullScreen: false },
  columns: [],
};
