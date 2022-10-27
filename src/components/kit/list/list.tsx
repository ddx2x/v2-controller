import { ProListMetas } from '@ant-design/pro-components';
import { ReactText, useState } from 'react';
import { IntlShape } from 'react-intl';
import ProList from './pro-list';

export interface ListProps {
  virtualList?: boolean;
  dataSource?: any[];
  metas?: ProListMetas<any> | undefined;
  intl?: IntlShape; // 国际化
}

export const List: React.FC<ListProps> = (props) => {
  const { virtualList, dataSource, metas } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

  return (
    <ProList
      virtualList={virtualList}
      dataSource={dataSource}
      metas={metas}
      rowSelection={rowSelection}
    />
  );
};

export default List;

List.defaultProps = {
  virtualList: true,
  dataSource: [],
  metas: {},
};
