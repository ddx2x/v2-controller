import { ExpandableConfig } from 'antd/lib/table/interface';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Table, TableProps } from '../table';

export declare type ExpandRowProps = {
  record?: any;
  onData: (record: any, index?: number, indent?: number, expanded?: boolean) => any;
} & { kind: 'table'; table: TableProps };

export declare type ExpandedConfig = ExpandableConfig<any> & ExpandRowProps;

const ExpandRow: React.FC<ExpandRowProps> = observer((props) => {
  const { kind, record, table, onData } = props
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    onData && onData(record).then((res: any) => setDataSource(res));
  }, []);

  if (kind == 'table') {
    return (
      <Table
        {...table}
        search={false}
        expanding={true}
        cardBordered={false}
        cardProps={{
          style: { background: '#fbfbfc'}
        }}
        dataSource={dataSource}
      />
    );
  }

  return null;
});

// 扩展
export const expandModule = (props: ExpandedConfig): ExpandableConfig<any> => {
  const { kind, table, onData, record, ...rest } = props;

  return {
    expandedRowRender: (record) => (
      <ExpandRow kind={kind} onData={onData} table={table} record={record} />
    ),
    ...rest,
  };
};
