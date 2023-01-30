import { ObjectStore } from '@/client'
import { observer } from 'mobx-react'
import { Table, TableProps } from './table'

export declare type StroeTableProps = TableProps & {
  store?: ObjectStore<any>
}

export const StoreTable: React.FC<StroeTableProps> = observer((props) => {
  const { store, ...rest } = props;

  console.log('store', store?.items);
  
  return <Table dataSource={store?.items || []} loading={store?.loading || false} {...rest} />
})