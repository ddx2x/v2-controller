import type { ActionType, ProListProps } from '@ant-design/pro-components';
import { FooterToolbar } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button } from 'antd';
import type { Location } from "history";
import { observer } from 'mobx-react';
import { ReactText, useEffect, useRef, useState } from 'react';
import type { IntlShape } from 'react-intl';
import { RouterHistory } from '../router';

import { ProList } from './proList';

export type ListProps = ProListProps & {
  virtualList?: boolean;
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

export const List: React.FC<ListProps> = observer((props) => {
  const {
    location,
    mount,
    unMount,
    virtualList,
    dataSource,
    useBatchDelete,
    batchDelete,
    toolBarRender,
    ...rest
  } = props;
  // ref
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    actionRef && mount && mount(location, actionRef)
    return () => actionRef && unMount && unMount(location, actionRef)
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

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
      <ProList
        showActions="hover"
        actionRef={actionRef}
        virtualList={virtualList}
        dataSource={dataSource}
        rowSelection={dataSource ? rowSelection : false}
        {...rest}
      />
      {footer()}
    </>
  );
});

List.defaultProps = {
  virtualList: true,
  pagination: false,
  cardBordered: true,
  dataSource: [],
  metas: {},
};
