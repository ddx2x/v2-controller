import { ObjectStore } from '@/client'
import { observer } from 'mobx-react'
import { Table, TableProps } from './table'

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>
}

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, ...rest } = props;
  return <Table value={store?.items || []} loading={store?.loading || false} {...rest} />
})