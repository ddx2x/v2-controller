import { ActionType, FooterToolbar, ProListProps } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import { ReactText, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import ProList from './pro-list';

export interface ListProps extends ProListProps {
  virtualList?: boolean;
  // 批量删除
  useBatchDelete?: boolean; // 开启批量删除
  batchDelete?: (selectedRowKeys: React.Key[]) => void; // 批量删除回调函数
  intl?: IntlShape; // 国际化
}

export const List: React.FC<ListProps> = (props) => {
  const { virtualList, dataSource, useBatchDelete, batchDelete, ...rest } = props;

  // ref
  const actionRef = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

  return (
    <>
      <ProList
        showActions="hover"
        actionRef={actionRef}
        virtualList={virtualList}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        {...rest}
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

export default List;

List.defaultProps = {
  virtualList: true,
  pagination: false,
  dataSource: [],
  metas: {},
};
