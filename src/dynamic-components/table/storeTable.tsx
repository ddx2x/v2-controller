import { ObjectStore } from '@/client';
import { cloneDeep, isEqual } from 'lodash';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
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
  treeStore?: ObjectStore<any> | any;
  defaultPageSize?: number;
  onRequest: (params: RequestParams) => void;
};

export const StoreTable: React.FC<StoreTableProps> = observer((props) => {
  const { store, defaultPageSize, onRequest, value, useSiderTree, treeStore, treeData, ...rest } =
    props;

  // 分页器参数
  const [params, updateParams] = useState<any>();

  const prevParam = useRef();

  const request = async (
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

    updateParams({
      query: {
        limit: { page: current - 1, size: size },
        sort: sort || {},
        filter: { ...more, ...filter },
      },
      location,
    });

    return { success: true };
  };

  useEffect(() => {
    if (params && !isEqual(prevParam.current, params)) {
      prevParam.current = cloneDeep(params.query);
      onRequest(params);
    }
  }, [params]);

  return (
    <Table
      useSiderTree={useSiderTree}
      value={value || store?.items || []}
      loading={store?.loading || false}
      pagination={{
        total: store?.count.get(),
        defaultPageSize: defaultPageSize || 0,
        showQuickJumper: true,
        showLessItems: true,
        showPrevNextJumpers: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 80],
      }}
      {...(useSiderTree && {
        treeData: treeData || treeStore?.tree || [],
      })}
      request={request}
      {...rest}
    />
  );
});
