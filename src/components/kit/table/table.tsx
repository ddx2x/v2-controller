import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { OptionConfig } from '@ant-design/pro-table/es/components/ToolBar';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import React, { useMemo, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';

const defaulScrollHeight = 600;

export interface TableLayout {
  edit?: boolean;
  columns?: ProColumns<any>[]; // https://procomponents.ant.design/components/table/#columns-%E5%88%97%E5%AE%9A%E4%B9%89
  rowKey?: string;
  dataSource?: any[];
  scrollHeight?: string | number; // 表格高度
  onLoading?: (actionRef: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  //
  headerTitle?: React.ReactNode; // 标题
  // 数据项 嵌套表格扩展
  // https://procomponents.ant.design/components/table#%E5%B5%8C%E5%A5%97%E8%A1%A8%E6%A0%BC
  expandable?: ExpandableConfig<any>;
  options?: OptionConfig;
  toolBarRender?:
    | false
    | ((
        action: ActionType | undefined,
        rows: {
          selectedRowKeys?: (string | number)[] | undefined;
          selectedRows?: any[] | undefined;
        },
      ) => React.ReactNode[])
    | undefined;
  intl?: IntlShape; // 国际化
  onSearch?: (params: any) => void;
  onReset?: () => void;
}

export const Table: React.FC<TableLayout> = (props) => {
  const {
    columns,
    dataSource,
    rowKey,
    onLoading,
    scrollHeight,
    headerTitle,
    intl,
    //
    useBatchDelete,
    batchDelete,
    //
    options,
    expandable,
    toolBarRender,
    onSearch,
    onReset,
  } = props;

  // ref
  const actionRef = useRef<ActionType>();

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
      height: scrollHeight || defaulScrollHeight,
      onReachEnd: () => onLoading && onLoading(actionRef),
    });
  }, []);

  //

  return (
    <>
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
        onSubmit={onSearch}
        onReset={onReset}
        actionRef={actionRef}
        rowKey={rowKey}
        toolBarRender={toolBarRender}
        columns={columns}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        expandable={expandable}
        options={{
          density: true,
          reload: false,
          fullScreen: true,
          ...options,
        }}
        pagination={false}
        // 虚拟滚动
        sticky
        scroll={{
          y: scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
        }}
        components={vComponents}
      />
      {useBatchDelete && selectedRowKeys?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              batchDelete && batchDelete(selectedRowKeys);
              setSelectedRowKeys([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}
    </>
  );
};

Table.defaultProps = {
  edit: false,
  rowKey: 'key',
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: {},
  columns: [],
  dataSource: [],
};

export default Table;
