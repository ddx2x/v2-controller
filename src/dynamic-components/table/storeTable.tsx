import { ObjectStore } from '@/client'
import { Table, TableProps } from './table'

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>
}

export const StoreTable: React.FC<StoreTableProps> = (props) => {
  const { store, ...rest } = props;
  return <Table
    value={store?.items || []}
    loading={store?.loading || false}
    pagination={{ total: store?.count }}
    {...rest}
  />
}