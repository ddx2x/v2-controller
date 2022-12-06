
import { Table, TableProps } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';

export declare type ExpandRowProps = {
  onDataRender: (
    record: any,
    index?: number,
    indent?: number,
    expanded?: boolean
  ) => any
  record?: any
} & (
    { kind: 'table', table: TableProps<any> }
  )

export declare type ExpandedConfig =
  ExpandableConfig<any> & ExpandRowProps


const ExpandRow: React.FC<ExpandRowProps> = (props) => {
  const [dataSource, setDataSource] = useState<any>([])

  useEffect(() => {
    props.onDataRender && props.onDataRender(props.record).then((res: any) => setDataSource(res))
  }, [])

  if (props.kind == 'table') {
    return <Table
      {...props.table}
      style={{ marginTop: 10, marginBottom: 10 }}
      pagination={false}
      dataSource={props.table.dataSource || dataSource}
    />
  }

  return null
}

// 扩展
export const expandModule = (props: ExpandedConfig): ExpandableConfig<any> => {
  const { kind, table, onDataRender, record, ...rest } = props;

  return {
    expandedRowRender: (record) => <ExpandRow kind={kind} onDataRender={onDataRender} table={table} record={record} />,
    ...rest,
  };
};
