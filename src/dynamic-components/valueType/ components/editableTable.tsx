
import {
  EditableProTable, ProFieldFCRenderProps, ProTableProps
} from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/es/components/EditableTable';
import { useState } from 'react';


export declare type EditableTableProps = ProFieldFCRenderProps & EditableProTableProps<any, any> & {
  editableValuesChange?: (record: any) => void
  onSelectedRows?: (selectedRows: any) => void
}

export const EditableTable: React.FC<EditableTableProps> = (props) => {
  const { columns, value, onChange, editableValuesChange, onSelectedRows, ...rest } = props

  const { dataSource, selectedRows } = value

  const [_selectedRows, setSelectedRows] = useState(selectedRows || []);
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (_: any, selectedRows: any) => {
      setSelectedRows(selectedRows);
      onSelectedRows && onSelectedRows(selectedRows)
      onChange && onChange({ dataSource, selectedRows: selectedRows })
    },
  };

  const recordCreatorPosition = 'hidden'

  return (
    <EditableProTable
      tableRender={(
        props: ProTableProps<any, any, 'text'>,
        defaultDom: JSX.Element,
        domList: {
          toolbar: JSX.Element | undefined;
          alert: JSX.Element | undefined;
          table: JSX.Element | undefined;
        },
      ) => domList.table}
      bordered
      columns={columns || []}
      value={dataSource || []}
      tableAlertRender={false}
      rowSelection={rowSelection}
      editable={{
        type: 'multiple',
        editableKeys: (dataSource || [])?.map((item: { [x: string]: any; }) => item[props['rowKey'] as string || 'id']) || [],
        actionRender: () => [],
        onValuesChange: (record) => editableValuesChange && editableValuesChange(record),
      }}
      recordCreatorProps={
        recordCreatorPosition !== 'hidden'
          ? {
            position: recordCreatorPosition as 'top',
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          }
          : false
      }
      {...rest}
    />
  )
}


export const EditableTableRenderFormItem: React.FC<EditableTableProps> = (props) => {
  return <EditableTable  {...props} />
}
export const EditableTableRender: React.FC<EditableTableProps> = (props) => {
  return <EditableTable {...props} />
}