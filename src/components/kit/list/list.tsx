import { ProListMetas } from '@ant-design/pro-components';
import { ReactText, useState } from 'react';
import { IntlShape } from 'react-intl';
import ProList from './pro-list';

interface ListProps {
  intl?: IntlShape;
  dataSource?: any[];
  metas?: ProListMetas<any> | undefined;
}

export const List: React.FC<ListProps> = (props) => {
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

export default List;

List.defaultProps = {
  dataSource: [],
  metas: {},
};

export const useList = (props: ListProps) => {
  return [<List {...props} />, {}];
};
