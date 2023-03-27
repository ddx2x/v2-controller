import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Spin, Transfer as AntdTransfer, TransferProps as AntdTransferProps } from 'antd';
import { useEffect, useState } from 'react';

export declare type TransferProps = ProFieldFCRenderProps &
  AntdTransferProps<any> & {
    initDataSource?: () => Promise<AntdTransferProps<any>['dataSource']>;
    onRender: AntdTransferProps<any>['render'];
  };

export const Transfer = (props: TransferProps) => {
  const [_dataSource, setDataSource] = useState<AntdTransferProps<any>['dataSource']>([]);
  const [loading, setLoading] = useState(true);
  const { value, initDataSource, onRender, ...rest } = props;

  useEffect(() => {
    if (!initDataSource) return;
    initDataSource()
      .then((res) => {
        setDataSource(res);
        setLoading(false);
      })
      .catch(() => {
        setDataSource([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Spin tip="配置加载中...." />
      </div>
    );
  }

  const render = onRender ? onRender : (item: any) => item.title;

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AntdTransfer
        style={{ margin: '0 auto' }}
        listStyle={{
          width: 250,
          height: 300,
        }}
        dataSource={_dataSource}
        targetKeys={value || []}
        render={render}
        {...rest}
      />
    </div>
  );
};

export const TransferRender: React.FC<TransferProps> = (props) => {
  return <Transfer {...props} />;
};

export const TransferRenderFormItem: React.FC<TransferProps> = (props) => {
  return <Transfer {...props} />;
};
