import type {
  ActionType,
  FormInstance,
  ProFormInstance,
  ProListProps,
  RouteContextType
} from '@ant-design/pro-components';
import type { Location } from 'history';
import lodash from 'lodash';
import { ObservableMap } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { RouterHistory } from '../router';
import { MenuButtonType } from '../table/menuButton';

import { ProList } from './proList';

const defaulScrollHeight = '52vh';

export type ListProps = ProListProps & {
  tableMenu?: (record?: any, action?: any) => MenuButtonType[]; // 更多操作
  toolBarMenu?: () => MenuButtonType[];
  footerButton?: () => MenuButtonType[];
  scrollHeight?: string | number; // 表格高度
  onNext?: (params?: any, actionRef?: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
} & RouterHistory & {
  onMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
    formRef?: React.MutableRefObject<FormInstance | undefined>,
    configMap?: ObservableMap<any, any>,
  ) => void;
  unMount?: (
    location: Location | undefined,
    actionRef: React.MutableRefObject<ActionType | undefined>,
    formRef?: React.MutableRefObject<FormInstance | undefined>,
    configMap?: ObservableMap<any, any>,
  ) => void;
};

export const List: React.FC<ListProps> = observer((props) => {
  const {
    location,
    onMount,
    unMount,
    dataSource,
    onNext,
    useBatchDelete,
    batchDelete,
    toolBarRender,
    scrollHeight,
    ...rest
  } = props;

  // ref

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

  // 虚拟滚动
  const vComponents = useMemo(() => {
    return VList({
      vid: 'uid',
      height: scrollHeight || defaulScrollHeight,
    });
  }, []);

  let defaultConfig: ListProps = {
    size: 'small',
    components: vComponents,
    editable: {
      onSave: async (key, record) => { },
    },
    search: {
      labelWidth: 80,
    },
    pagination: {
      onChange: (page: number, size: number) => onNext && onNext({ page, size }, actionRef),
    },
    onReset: () => props.onSubmit && props.onSubmit({}),
  };

  // 合并配置
  lodash.merge(rest, defaultConfig);

  return (
    <ProList
      actionRef={actionRef}
      formRef={formRef}
      showActions="hover"
      {...rest}
    />
  );
});

List.defaultProps = {
  pagination: false,
  cardBordered: true,
  dataSource: [],
  metas: {},
};
