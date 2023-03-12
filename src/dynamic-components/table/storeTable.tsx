import { ObjectStore } from '@/client';
import { observer } from 'mobx-react';
import { Table, TableProps } from './table';

export declare type RequestParams = {
  query: {
    limit: {
      page: number;
      size: number;
    },
    sort: { [key: string]: any },
    filter: { [key: string]: any }
  },
  location: Location | null | undefined
}

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>;
  defaultPageSize?: number;
  onRequest?: (params: RequestParams) => void
}

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, defaultPageSize, onRequest, value, ...rest } = props;
  return (
    <Table
      // value={value || store?.items || []}
      // loading={store?.loading || false}
      pagination={{
        total: store?.count,
        defaultPageSize: defaultPageSize || 10,
        showQuickJumper: true,
        showLessItems: true,
        showPrevNextJumpers: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 80],
      }}
      request={async (params: any, sort: {}, filter: {}) => {
        
        const { pageSize: size, current, ...more } = params;
        // 删除空值
        Object.keys(more).forEach((key) => {
          if (more[key] === undefined || more[key] === null || more[key] === '') {
            delete more[key];
          }
        });

        onRequest && onRequest({
          query: {
            limit: { page: current - 1, size: size },
            sort: sort || {},
            filter: { ...more }
          }, location
        });
        return { success: true };
      }}
      {...rest}
    />
  );
});
