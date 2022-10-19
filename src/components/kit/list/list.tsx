import { ProList, ProListMetas } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { IntlShape } from 'react-intl';
import { VList } from 'virtuallist-antd';

interface ScrollListProps {
  intl?: IntlShape;
  scrollHeight?: number;
  dataSource: any[];
  metas?: ProListMetas<any> | undefined;
}

export interface List extends ScrollListProps {}

export const ScrollList: React.FC<ScrollListProps> = (props) => {
  const vComponents = useMemo(() => {
    return VList({
      height: props.scrollHeight || 500,
      onReachEnd: () => {},
    });
  }, []);

  return (
    <ProList
      dataSource={props.dataSource}
      metas={props.metas}
      sticky
      scroll={{
        y: props.scrollHeight, // 滚动的高度, 可以是受控属性。 (number | string) be controlled.
      }}
      components={vComponents}
    />
  );
};
