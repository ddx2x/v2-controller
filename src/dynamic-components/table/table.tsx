import { ActionType, ProFormInstance, ProTable, ProTableProps, RouteContextType } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import {
  Button, FormInstance, Space
} from 'antd';
import type { Location } from 'history';
import lodash from 'lodash';
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

const defaulScrollHeight = '52vh';

export declare type TableProps = ProTableProps<any, any> & {
  tableMenu?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarMenu?: () => MenuButtonType[];
  footerButton?: () => MenuButtonType[];
  scrollHeight?: string | number; // 表格高度
  onNext?: (
    params?: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  expanding?: boolean;
  expand?: ExpandedConfig;
  // hook
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
  // 鼠标事件
  onRow?: {
    mouseEvent: 'onClick' | 'onDoubleClick',
    triggerKey: string
  }[]
} & RouterHistory & {
  mount?: (
    location?: Location | undefined,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
    formRef?: React.MutableRefObject<FormInstance | undefined>,
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
    // 批量删除
    useBatchDelete,
    batchDelete,
    // 鼠标事情
    onRow,
    // hook
    intl,
    routeContext,
    ...rest
  } = props;

  const configMap = observable.map({})
  // ref
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  mount && mount(
    location, actionRef, formRef, configMap
  );

  // 页面挂载 销毁事件
  useEffect(() => {
    return () => unMount && unMount(
      location, actionRef, configMap
    );
  }, []);

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

  let paginationDom: any = null

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
            </>) : paginationDom}
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

    console.log('defaultDom', domList.table);

    // document.getElementsByClassName()

    if (expanding) {
      return defaultDom;
    }

    return (
      <>
        <div ref={(scrollHeight !== '100%') ? setContainer : null}>{defaultDom}</div>
        <LoadMore />
        <Footer />
      </>
    );
  };

  // 挂载行
  let newColumns = columns || [];
  let [mT, setMT] = useState<(() => void)[][]>([])
  // 更多操作 按钮
  if (newColumns) {
    newColumns = newColumns.filter((item) => item.dataIndex != 'more');
    newColumns.push({
      dataIndex: 'more',
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (text: any, record: any, index: any, action: any) => {
        let buttons = tableMenu ? tableMenu(record, action) : []
        // buttons.length < 1 && setOptionColumnsHide(true)
        // 生成菜单
        const dom = (
          <MenuButtonGroup
            key={randomKey(5, { numbers: false })}
            menuButtons={buttons}
            gT={T => { mT[index] = T; setMT(mT) }}
          />
        )
        // !dom && setOptionColumnsHide(true)
        return dom
      }
    })
  }

  // 工具栏操作
  let toolBarMenus = [
    <MenuButtonGroup
      key={randomKey(5, { numbers: false })}
      menuButtons={toolBarMenu ? toolBarMenu() : []}
    />
  ]

  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      vid: 'uid',
      height: scrollHeight || defaulScrollHeight,
    });
  }, []);

  let defaultConfig: TableProps = {
    size: 'small',
    columns: newColumns,
    components: vComponents,
    toolbar: {
      actions: toolBarMenus
    },
    editable: {
      onSave: async (key, record) => {
        console.log('editable onSave......', key, record)
      },
    },
    expandable: {
      ...expandModule(expand ? expand : null)
    },
    search: {
      labelWidth: 80,
    },
    tableRender,
    pagination: {
      onChange: (page: number, size: number) => onNext && onNext({ page, size }, actionRef)
    },
    onSubmit: (param) => onNext && onNext(param, actionRef),
    onReset: () => props.onSubmit && props.onSubmit({}),
  }

  // 合并配置
  lodash.merge(rest, defaultConfig)
  lodash.merge(rest, Object.fromEntries(configMap))

  return (
    <ProTable
      // ref
      actionRef={actionRef}
      formRef={formRef}
      rowSelection={rowSelection}
      scroll={{ y: scrollHeight, x: "100%" }}
      {...rest}
    />
  );
});

Table.defaultProps = {
  type: 'table',
  expanding: false,
  cardBordered: true,
  scrollHeight: defaulScrollHeight,
  options: { density: true, reload: false, fullScreen: false },
  columns: [],
  useBatchDelete: true,
};
