import { ExpandableConfig } from 'antd/lib/table/interface';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Table, TableProps } from '../table';

export declare type ExpandRowProps = {
  record?: any;
  onDataRender: (record: any, index?: number, indent?: number, expanded?: boolean) => any;
} & { kind: 'table'; table: TableProps };

export declare type ExpandedConfig = ExpandableConfig<any> & ExpandRowProps;

const ExpandRow: React.FC<ExpandRowProps> = observer((props) => {
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    props.onDataRender && props.onDataRender(props.record).then((res: any) => setDataSource(res));
  }, []);

  if (props.kind == 'table') {
    return (
      <Table
        {...props.table}
        search={false}
        expanding={true}
        dataSource={props.table.dataSource || dataSource}
      />
    );
  }

  return null;
});

// 扩展
export const expandModule = (props: ExpandedConfig): ExpandableConfig<any> => {
  const { kind, table, onDataRender, record, ...rest } = props;

  return {
    expandedRowRender: (record) => (
      <ExpandRow kind={kind} onDataRender={onDataRender} table={table} record={record} />
    ),
    ...rest,
  };
};
