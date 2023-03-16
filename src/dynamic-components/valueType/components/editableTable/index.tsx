
import {
  EditableProTable, ProFieldFCRenderProps
} from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/es/components/EditableTable';
import { useState } from 'react';
import './index.scss';

export declare type EditableTableProps = ProFieldFCRenderProps & EditableProTableProps<any, any> & {
  editableValuesChange?: (record: any) => void
  onSelectedRows?: (selectedRows: any) => void
}

export const EditableTable: React.FC<EditableTableProps> = (props) => {
  const { rowKey, columns, value, onChange, editableValuesChange, onSelectedRows, ...rest } = props

  let dataSource = value?.dataSource || []
  let selectedRows = value?.selectedRows || []

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
      rowKey={rowKey}
      prefixCls='editableTable'
      bordered
      columns={columns || []}
      value={dataSource || []}
      tableAlertRender={false}
      rowSelection={rowSelection}
      editable={{
        type: 'multiple',
        editableKeys: (dataSource || [])?.map((item: { [x: string]: any; }) => item[props['rowKey'] as string || 'id']) || [],
        actionRender: () => [],
        onValuesChange: (record, dataSource) => {
          let key = rowKey || 'id'
          let selectedRows = _selectedRows.map((s_item: any) => {
            let updated = dataSource.filter(d_item => d_item[key as string] == s_item[key as string])
            if (updated) return updated[0]
            return s_item
          })
          setSelectedRows(selectedRows);
          onSelectedRows && onSelectedRows(selectedRows)
          onChange && onChange({ dataSource, selectedRows })
        },
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