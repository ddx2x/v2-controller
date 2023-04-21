import {
  ActionType,
  FormInstance,
  ProFormInstance,
  ProListProps,
  RouteContextType
} from '@ant-design/pro-components';
import type { Location } from 'history';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { RouterHistory } from '../router';
import { MenuButtonType } from '../table/menuButton';

import { ProList } from './proList';

const defaulScrollHeight = '52vh';

export type ListProps = ProListProps & {
  useTableMoreOption?: boolean // 开启表单操作菜单
  tableMenu?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarMenu?: (selectedRows?: any) => MenuButtonType[];
  editableValuesChange?: (record: any) => void
  // 表格高度
  scrollHeight?: string | number;
  // 虚拟滚动 加载数据
  onRequest?: (
    params?: any,
    sort?: any,
    filter?: any,
    treeSelectedNode?: any,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void;
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory & {
  onMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
    formRef?: React.MutableRefObject<FormInstance | undefined>
  ) => void;
  unMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
    formRef?: React.MutableRefObject<FormInstance | undefined>,
  ) => void;
};

export const List: React.FC<ListProps> = (props) => {
  const {
    useTableMoreOption,
    metas,
    dataSource,
    editableValuesChange,
    location,
    onMount,
    unMount,
    onRequest,
    useBatchDelete,
    batchDelete,
    toolBarRender,
    scrollHeight,
    ...rest
  } = props;

  // ref
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  // 页面挂载 销毁事件
  useEffect(() => {
    return () => unMount && unMount(location, actionRef, formRef);
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

  // 多选
  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (_: any, selectedRows: any) => { setSelectedRows(selectedRows) },
  };

  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      vid: 'uid',
      height: scrollHeight || defaulScrollHeight,
    });
  }, []);

  if (useTableMoreOption) {

  }

  const request = async (params: any, sort: {}, filter: {}) => {
    const { pageSize: size, current: current, ...more } = params;
    const order = sort;
    const page = current - 1;
    onRequest && onRequest({ limit: { size, page }, filter: { ...more } }, order, filter, null, actionRef);
    return { success: true };
  }

  return (
    <ProList
      metas={metas}
      dataSource={dataSource}
      split={true}
      actionRef={actionRef}
      formRef={formRef}
      rowSelection={rowSelection}
      editable={{
        type: 'multiple',
        editableKeys: dataSource?.map(item => item[props['rowKey'] as string || 'id']) || [],
        actionRender: () => { return [] },
        onValuesChange: (record) => editableValuesChange && editableValuesChange(record),
      }}
      showActions="hover"
      size='small'
      request={request}
      components={vComponents}
      search={{
        labelWidth: 80,
      }}
      {...rest}
    />
  );
};

List.defaultProps = {
  cardBordered: true,
  dataSource: [],
  metas: {},
};
