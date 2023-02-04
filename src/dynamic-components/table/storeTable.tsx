import { ObjectStore } from '@/client'
import { observer } from 'mobx-react'
import { Table, TableProps } from './table'

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>
  pageSize?: number;
}

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, pageSize, ...rest } = props;
  return <Table
    value={store?.items || []}
    loading={store?.loading || false}
    pagination={{ total: store?.count, pageSize: pageSize }}
    {...rest}
  />
})