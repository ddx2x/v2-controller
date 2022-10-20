import { ProListMetas } from '@ant-design/pro-components';
import { ReactText, useState } from 'react';
import { IntlShape } from 'react-intl';
import ProList from './pro-list';

interface ScrollListProps {
  intl?: IntlShape;
  dataSource: any[];
  metas?: ProListMetas<any> | undefined;
}

export interface List extends ScrollListProps {}

export const ScrollList: React.FC<ScrollListProps> = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

  return (
    <ProList
      virtualList={true}
      dataSource={props.dataSource}
      metas={props.metas}
      rowSelection={rowSelection}
    />
  );
};
