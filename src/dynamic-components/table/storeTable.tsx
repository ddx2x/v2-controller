import { ObjectStore } from '@/client';
import { observer } from 'mobx-react';
import { Table, TableProps } from './table';

export declare type RequestParams = {
  query: {
    limit: {
      page: number;
      size: number;
    };
    sort: { [key: string]: any };
    filter: { [key: string]: any };
  };
  location: Location | null | undefined;
};

export declare type StoreTableProps = TableProps & {
  store?: ObjectStore<any>;
  treeStore?: ObjectStore<any>;
  defaultPageSize?: number;
  onRequest?: (params: RequestParams) => void;
};

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {

  const {
    store,
    defaultPageSize,
    onRequest,
    value,
    useSiderTree,
    treeStore,
    treeData,
    ...rest
  } = props;


  return (
    <Table
      useSiderTree={useSiderTree}
      value={value || store?.items || []}
      loading={store?.loading || false}
      pagination={{
        total: store?.count,
        defaultPageSize: defaultPageSize || 10,
        showQuickJumper: true,
        showLessItems: true,
        showPrevNextJumpers: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 80],
      }}
      {...useSiderTree && {
        treeData: treeData || treeStore?.items || [],
      }}
      request={async (
        params: { [key: string]: any },
        sort: { [key: string]: any },
        filter: { [key: string]: any },
      ) => {
        const { pageSize: size, current, ...more } = params;

        // 删除空值
        Object.keys(more).forEach((key) => {
          if (more[key] === undefined || more[key] === null || more[key] === '') {
            delete more[key];
          }
        });

        Object.keys(sort).map((k: string) => {
          if (sort[k] == 'ascend') {
            sort[k] = 1;
          }
          if (sort[k] == 'descend') {
            sort[k] = 2;
          }
        });

        onRequest &&
          onRequest({
            query: {
              limit: { page: current - 1, size: size },
              sort: sort || {},
              filter: { ...more, ...filter },
            },
            location,
          });

        return { success: true };
      }}
      {...rest}
    />
  );
});
