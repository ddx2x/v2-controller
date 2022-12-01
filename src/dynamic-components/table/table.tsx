import { ActionType, ProTable, ProTableProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, ButtonProps, Radio, RadioProps, Space, Switch, SwitchProps } from 'antd';
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



const defaulScrollHeight = '500px';

export declare type TableProps = Omit<ProTableProps<any, any>, 'dataSource' | 'loading' | 'expandable'> & {
  loading?: Function | boolean
  dataSource?: Function | any[]
  virtualList?: boolean;
  expand?: ExpandedConfig;
  scrollHeight?: string | number; // 表格高度
  moreMenuButton?: (record: any) => MoreButtonType[],
  onLoading?: (actionRef?: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
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
  // ref
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    actionRef && mount && mount(location, actionRef)
    return () => actionRef && unMount && unMount(location, actionRef)
  }, [])

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
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

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
    rest.sticky = true;
    rest.scroll = {
      y: scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
    };
    rest.components = vComponents;
    rest.pagination = false;
  }

  // 更多操作 按钮
  if (moreMenuButton && newColumns) {
    newColumns = injectTableOperate(moreMenuButton, newColumns)
  }

  // 数据
  let data = typeof dataSource == 'function' ? dataSource() : dataSource

  return (
    <div ref={setContainer}>
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
        expandable={expand && { ...expandModule(expand) }}
        {...rest}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button style={{ width: '350px' }} key='loadMore' onClick={() => onLoading && onLoading(actionRef)}>
          加载更多
          {data.lenght > 0 || `（已展示${data.length}条）`}
        </Button>
      </div>
    </div>
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
