import { ObjectStore } from '@/client'
import { ActionType } from '@ant-design/pro-components'
import { observer } from 'mobx-react'
import { Table, TableProps } from './table'

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>
  defaultPageSize?: number;
  onRequest?: (
    params?: any,
    sort?: any,
    filter?: any,
    location?: Location | null | undefined,
    actionRef?: React.MutableRefObject<ActionType | undefined>,
  ) => void;
}

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, defaultPageSize, onRequest, value, ...rest } = props;
  return (
    <Table
      value={value || store?.items || []}
      loading={store?.loading || false}
      pagination={{
        total: store?.count,
        defaultPageSize: defaultPageSize || 10,
        showQuickJumper: true,
        showLessItems: true,
        showPrevNextJumpers: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 80]
      }}
      request={async (params: any, sort: {}, filter: {}) => {
        const { pageSize: size, current, ...more } = params;
        const order = sort;
        const page = current - 1;
        onRequest && onRequest({ limit: { page: page, size: size, }, filter: { ...more } }, order, filter, location);
        return { success: true };
      }}
      {...rest}
    />
  )
})