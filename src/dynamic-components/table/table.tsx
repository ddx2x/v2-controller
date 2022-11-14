import { ActionType, FooterToolbar, ProTable, ProTableProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';
import { ExtraAction, extraActionArray } from '../extensions/action';

const defaulScrollHeight = 550;

export type TableProps = ProTableProps<any, any> & {
  virtualList?: boolean;
  scrollHeight?: string | number; // 表格高度
  onLoading?: (actionRef: React.MutableRefObject<ActionType | undefined>) => void; // 虚拟滚动 加载数据
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
  toolBarExtraRender?: ExtraAction[];
};

export const Table: React.FC<TableProps> = (props) => {
  const {
    virtualList,
    dataSource,
    onLoading,
    scrollHeight,
    headerTitle,
    toolBarExtraRender,
    toolBarRender,
    intl,
    //
    useBatchDelete,
    batchDelete,
    ...rest
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

  if (virtualList) {
    rest['sticky'] = true;
    rest['scroll'] = {
      y: scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
    };
    rest['components'] = vComponents;
    rest['pagination'] = false;
  }

  const footer = () => {
    return (
      useBatchDelete &&
      selectedRowKeys?.length > 0 && (
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
      )
    );
  };

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
        actionRef={actionRef}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        toolBarRender={
          toolBarExtraRender ? () => extraActionArray(toolBarExtraRender) : toolBarRender
        }
        {...rest}
      />
      {footer()}
    </>
  );
};

Table.defaultProps = {
  type: 'list',
  virtualList: true,
  editable: {
    type: 'multiple',
  },
  cardBordered: true,
  rowKey: 'key',
  scrollHeight: defaulScrollHeight,
  useBatchDelete: true,
  options: { density: true, reload: false, fullScreen: true },
  columns: [],
  dataSource: [],
};

export default Table;