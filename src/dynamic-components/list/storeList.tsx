import { ObjectStore } from '@/client'
import { observer } from 'mobx-react'
import { List, ListProps } from './list'

export declare type StoreListProps = ListProps & {
  store?: ObjectStore<any>
}

export const StoreList: React.FC<StoreListProps> = observer((props) => {
  const { store, ...rest } = props;
  return <List
    dataSource={store?.items || []}
    loading={store?.loading || false}
    pagination={{ total: store?.count, pageSize: 1 }}
    {...rest}
  />
})