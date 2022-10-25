import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import React, { useMemo, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';

interface TableProps {
  scrollHeight?: number;
  useBatchDelete?: boolean;
  batchDelete?: (selectedRowKeys: React.Key[]) => void;
  columns?: ProColumns<any>[];
  dataSource?: any[];
  headerTitle?: React.ReactNode;
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
  onLoading?: (actionRef: React.MutableRefObject<ActionType | undefined>) => void;
  intl?: IntlShape;
}

export interface TableLayout extends TableProps {}

export const Table: React.FC<TableProps> = (props) => {
  const {
    scrollHeight,
    headerTitle,
    intl,
    columns,
    dataSource,
    useBatchDelete,
    batchDelete,
    expandable,
    onLoading,
    toolBarRender,
  } = props;

  const actionRef = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const vComponents = useMemo(() => {
    return VList({
      height: scrollHeight || 500,
      onReachEnd: () => onLoading && onLoading(actionRef),
    });
  }, []);

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
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={toolBarRender}
        columns={columns}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        expandable={expandable}
        pagination={false}
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
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
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
    </>
  );
};

Table.defaultProps = {
  scrollHeight: 500,
  useBatchDelete: true,
  columns: [],
  dataSource: [],
};

export default Table;
