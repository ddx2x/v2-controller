
import {
  EditableProTable, ProFieldFCRenderProps, ProTableProps
} from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/es/components/EditableTable';
import { useState } from 'react';


export declare type EditableTableProps = ProFieldFCRenderProps & EditableProTableProps<any, any> & {
  editableValuesChange?: (record: any) => void
}

export const EditableTable: React.FC<EditableTableProps> = (props) => {
  const { columns, value, editableValuesChange, ...rest } = props

  const [selectedRows, setSelectedRows] = useState([]);
  const rowSelection = {
    preserveSelectedRowKeys: true,
    onChange: (_: any, selectedRows: any) => { setSelectedRows(selectedRows) },
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
      value={value || []}
      tableAlertRender={false}
      rowSelection={rowSelection}
      editable={{
        type: 'multiple',
        editableKeys: value?.map((item: { [x: string]: any; }) => item[props['rowKey'] as string || 'id']) || [],
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