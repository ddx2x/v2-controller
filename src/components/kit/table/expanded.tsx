import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Table, TableColumnsType } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';

// 树型展示 https://ant.design/components/table-cn/#components-table-demo-tree-data

// 表格 table

interface ExpandedRowTableProps {
  useProTable?: boolean;
  columns?: TableColumnsType<any> | ProColumns<any>[];
  dataSource?: any[];
}

export const ExpandedRowTable: React.FC<ExpandedRowTableProps> = (props) => {
  const { useProTable, columns, dataSource } = props;
  return useProTable ? (
    <ProTable
      style={{ marginTop: 10, marginBottom: 10 }}
      ghost
      pagination={false}
      headerTitle={false}
      search={false}
      options={false}
      columns={columns as ProColumns<any>[]}
      dataSource={dataSource}
    />
  ) : (
    <Table pagination={false} columns={columns as TableColumnsType<any>} dataSource={dataSource} />
  );
};

ExpandedRowTable.defaultProps = {
  useProTable: false,
  columns: [],
  dataSource: [],
};

// 文本

interface ExpandedRowAnyProps {
  content?: (record: any) => any | string | React.ReactNode;
  record?: any;
}

export const ExpandedRowAny: React.FC<ExpandedRowAnyProps> = (props) => {
  let { content, record } = props;
  if (typeof content == 'string') {
    return <p style={{ margin: 0 }}>{content}</p>;
  }
  if (typeof content == 'function') {
    content = content(record);
  }
  return <div style={{ margin: 0 }}>{content}</div>;
};

// 扩展

export interface ExpandedProps<T>
  extends ExpandableConfig<T>,
    ExpandedRowTableProps,
    ExpandedRowAnyProps {
  rowRender: 'table' | 'any';
}

export const expanded = (props: ExpandedProps<any>): ExpandableConfig<any> => {
  const { rowRender, columns, dataSource, content, ...rest } = props;
  const render = (record: any) => {
    switch (rowRender) {
      case 'table':
        return <ExpandedRowTable columns={columns} dataSource={dataSource} />;
      case 'any':
        return <ExpandedRowAny content={content} record={record} />;
      default:
        return null;
    }
  };

  return {
    expandedRowRender: (record: any) => render(record),
    ...rest,
  };
};
