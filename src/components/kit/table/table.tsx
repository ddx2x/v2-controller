import { PlusOutlined } from '@ant-design/icons';
import { ActionType, FooterToolbar, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';

interface TableProps {
  scrollHeight?: number;
  useBatchDelete?: boolean;
  batchDelete?: (selectedRowKeys: React.Key[]) => void;
  columns: ProColumns<any>[];
  dataSource: any[];
  headerTitle?: React.ReactNode;
  intl?: IntlShape;
}

export interface Table extends TableProps {}

export const ScrollTable: React.FC<TableProps> = (props) => {
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
      height: props.scrollHeight || 500,
      onReachEnd: () => {},
    });
  }, []);

  return (
    <>
      <ProTable
        headerTitle={
          props.headerTitle
            ? props.headerTitle
            : props.intl &&
              props.intl.formatMessage({
                id: 'pages.searchTable.title',
                defaultMessage: 'Enquiry form',
              })
        }
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columns={props.columns}
        dataSource={props.dataSource}
        rowSelection={props.dataSource ? rowSelection : false}
        pagination={false}
        sticky
        scroll={{
          y: props.scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
        }}
        components={vComponents}
      />
      {props.useBatchDelete && selectedRowKeys?.length > 0 && (
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
              props.batchDelete && props.batchDelete(selectedRowKeys);
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

ScrollTable.defaultProps = {
  scrollHeight: 500,
};
