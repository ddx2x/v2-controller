
import { Table, TableProps } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';


// 文本
export declare type ExpandedRowAnyProps = {
  content: string | React.ReactNode;
}

export const ExpandedRowAny: React.FC<ExpandedRowAnyProps> = (props) => {
  let { content } = props;
  return <div style={{ margin: 0 }}>{content}</div>;
};

// 扩展
export declare type ExpandedConfig =
  ExpandableConfig<any> & {
    onDataRender: (record: any) => any
  } & (
    { kind: 'table', table: TableProps<any> } |
    { kind: 'any' }
  )


export const expandModule = (props: ExpandedConfig): ExpandableConfig<any> => {
  const { kind, onDataRender, ...rest } = props;

  return {
    expandedRowRender: (record: any) => {
      switch (kind) {
        case 'table':
          const { table } = props
          return table && (
            <Table
              style={{ marginTop: 10, marginBottom: 10 }}
              pagination={false}
              dataSource={table.dataSource || onDataRender(record)}
              {...table}
            />
          );
        case 'any':
          return (
            <ExpandedRowAny content={onDataRender(record)} />
          );
        default:
          return null;
      }
    },
    ...rest,
  };
};
