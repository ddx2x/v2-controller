import { ExpandableConfig } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { Table, TableProps } from '../table';

export declare type ExpandRowProps = {
  record?: any;
  onData?: (record: any, index?: number, indent?: number, expanded?: boolean) => any;
} & { kind: 'table'; table: TableProps };

export declare type ExpandedConfig = ExpandableConfig<any> & ExpandRowProps;

const ExpandRow: React.FC<ExpandRowProps> = (props) => {
  const { kind, record, table, onData } = props;
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    onData && onData(record).then((res: any) => { console.log('res', res); setDataSource(res)});
  }, []);

  console.log(dataSource, '....')

  if (kind === 'table') {
    return (
      <Table
        {...table}
        isExpandNode={true}
        cardBordered={false}
        cardProps={{
          style: { background: '#fbfbfc' },
        }}
        search={false}
        value={dataSource}
      />
    );
  }

  return null;
};

// 扩展
export const expandModule = (config: ExpandedConfig | null): ExpandableConfig<any> => {
  if (!config) return {};
  const { kind, table, onData, record, ...rest } = config;

  return {
    expandedRowRender: (record) => (
      <ExpandRow
        kind={kind} 
        onData={onData} 
        table={table}  
        record={record}
      />
    ),
    ...rest,
  };
};
