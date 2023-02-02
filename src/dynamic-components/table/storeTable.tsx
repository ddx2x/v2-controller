import { ObjectStore } from '@/client'
import { Table, TableProps } from './table'
import { observer } from 'mobx-react'

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>
}

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, ...rest } = props;
  return <Table
    value={store?.items || []}
    loading={store?.loading || false}
    pagination={{ total: store?.count }}
    {...rest}
  />
})