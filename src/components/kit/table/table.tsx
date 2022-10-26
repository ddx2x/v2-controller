import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import React, { useMemo, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';

export interface TableLayout {
  columns?: ProColumns<any>[];
  rowKey?: string;
  dataSource?: any[];
  scrollHeight?: number; // 表格高度
  onLoading?: (actionRef: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  //
  headerTitle?: React.ReactNode; // 标题
  // 数据项 嵌套表格扩展
  // https://procomponents.ant.design/components/table#%E5%B5%8C%E5%A5%97%E8%A1%A8%E6%A0%BC
  expandable?: ExpandableConfig<any>;
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
    expandable,
    toolBarRender,
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
      height: scrollHeight || 500,
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
        actionRef={actionRef}
        rowKey={rowKey}
        toolBarRender={toolBarRender}
        columns={columns}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        expandable={expandable}
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
  rowKey: 'key',
  scrollHeight: 600,
  useBatchDelete: true,
  columns: [],
  dataSource: [],
};

export default Table;
